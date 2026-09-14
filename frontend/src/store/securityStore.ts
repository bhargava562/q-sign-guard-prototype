import { create } from "zustand";
import type {
  TransactionPayload,
  SignedTransactionPacket,
  CanonicalContext,
  PipelinePhase,
  LifecycleState,
  SecurityDecision,
  SecurityStatus,
  ThemeMode,
  OperatorStage,
  ActiveNavTab,
  IncomingRequestItem,
} from "../types/transaction";
import { buildCanonicalContext, canonicalizeJson, canonicalStringToBytes } from "../engine/canonicalize";
import { defaultSignatureProvider } from "../engine/signatureProvider";
import { defaultReplayStore } from "../engine/replayGuard";
import { evaluateTransactionGateway } from "../engine/decisionEngine";
import { DEFAULT_INCOMING_REQUESTS, INVALID_REQUEST_SCENARIOS } from "../data/incomingRequests";

export interface AuditEvent {
  id: string;
  timestamp: string;
  transactionId: string;
  summary: string;
  status: SecurityStatus;
  authenticity: "valid" | "invalid";
  execution: "authorized" | "blocked";
  ruleViolated: string;
  reason: string;
  packet: SignedTransactionPacket;
  decision: SecurityDecision;
}

export interface SecurityStoreState {
  theme: ThemeMode;
  activeTab: ActiveNavTab;
  operatorStage: OperatorStage;
  
  // Incoming Request Queue
  incomingRequests: IncomingRequestItem[];
  selectedIncomingRequest: IncomingRequestItem;
  
  // Transaction & Cryptographic State
  payload: TransactionPayload;
  canonicalContext: CanonicalContext | null;
  activePacket: SignedTransactionPacket | null;
  baselineAuthorizedPacket: SignedTransactionPacket | null;
  
  // Pipeline & Guard State
  pipelinePhase: PipelinePhase;
  lifecycleState: LifecycleState;
  guardStates: {
    signaturePassed: boolean | null;
    contextPassed: boolean | null;
    freshnessPassed: boolean | null;
  };
  lastDecision: SecurityDecision | null;
  
  // Audit Ledger & Evidence Drawer
  auditEvents: AuditEvent[];
  evidenceDrawerOpen: boolean;
  activeEvidencePacket: SignedTransactionPacket | null;
  activeEvidenceDecision: SecurityDecision | null;
  
  // Controls
  isProcessing: boolean;
  reducedMotion: boolean;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  setActiveTab: (tab: ActiveNavTab) => void;
  setOperatorStage: (stage: OperatorStage) => void;
  selectIncomingRequest: (req: IncomingRequestItem) => void;
  setReducedMotion: (enabled: boolean) => void;
  
  // Evidence Drawer Actions
  openEvidenceSheet: (packet?: SignedTransactionPacket, decision?: SecurityDecision) => void;
  closeEvidenceSheet: () => void;
  
  // Core Operator Workflow Actions
  verifyAndProcess: () => Promise<void>;
  triggerDuplicateArrival: () => void;
  processDuplicate: () => Promise<void>;
  testInvalidScenario: (scenarioId: string) => Promise<void>;
  resetToIncoming: () => void;
}

function getInitialTheme(): ThemeMode {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("q-signguard-theme") as ThemeMode | null;
    if (saved === "light" || saved === "dark") return saved;
  }
  return "light";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useSecurityStore = create<SecurityStoreState>((set, get) => {
  const initialRequest = DEFAULT_INCOMING_REQUESTS[0];
  const now = new Date();
  
  const initialPayload: TransactionPayload = {
    message: initialRequest.message,
    sender: initialRequest.sender,
    receiver: initialRequest.receiver,
    sessionId: initialRequest.sessionId,
    nonce: "N-88321",
    sequence: 104,
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
  };

  return {
    theme: getInitialTheme(),
    activeTab: "protect",
    operatorStage: "incoming",
    
    incomingRequests: DEFAULT_INCOMING_REQUESTS,
    selectedIncomingRequest: initialRequest,
    
    payload: initialPayload,
    canonicalContext: null,
    activePacket: null,
    baselineAuthorizedPacket: null,
    
    pipelinePhase: "idle",
    lifecycleState: "EMPTY",
    guardStates: {
      signaturePassed: null,
      contextPassed: null,
      freshnessPassed: null,
    },
    lastDecision: null,
    
    auditEvents: [],
    evidenceDrawerOpen: false,
    activeEvidencePacket: null,
    activeEvidenceDecision: null,
    
    isProcessing: false,
    reducedMotion: false,

    setTheme: (theme: ThemeMode) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("q-signguard-theme", theme);
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      set({ theme });
    },

    setActiveTab: (activeTab) => set({ activeTab }),
    setOperatorStage: (operatorStage) => set({ operatorStage }),
    setReducedMotion: (reducedMotion) => set({ reducedMotion }),

    selectIncomingRequest: (req: IncomingRequestItem) => {
      const now = new Date();
      const lastSeq = defaultReplayStore.getLastSequence(req.sessionId) ?? 103;
      const nextPayload: TransactionPayload = {
        message: req.message,
        sender: req.sender,
        receiver: req.receiver,
        sessionId: req.sessionId,
        nonce: `N-${Math.floor(10000 + Math.random() * 90000)}`,
        sequence: lastSeq + 1,
        issuedAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
      };
      set({
        selectedIncomingRequest: req,
        payload: nextPayload,
        operatorStage: "incoming",
        pipelinePhase: "idle",
        lifecycleState: "EMPTY",
        guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
      });
    },

    openEvidenceSheet: (packet, decision) => {
      const p = packet || get().activePacket || get().baselineAuthorizedPacket;
      const d = decision || get().lastDecision;
      set({
        evidenceDrawerOpen: true,
        activeEvidencePacket: p,
        activeEvidenceDecision: d,
      });
    },

    closeEvidenceSheet: () => set({ evidenceDrawerOpen: false }),

    verifyAndProcess: async () => {
      const { payload, reducedMotion, selectedIncomingRequest } = get();
      const stepDelay = reducedMotion ? 0 : 250;

      set({
        isProcessing: true,
        operatorStage: "verifying",
        lifecycleState: "PROCESSING",
        pipelinePhase: "collecting",
        guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
      });

      // 1. Build Canonical Context & Sign (deterministic simulation)
      const canonicalContext = buildCanonicalContext(payload);
      const canonicalJson = canonicalizeJson(canonicalContext);
      const canonicalBytes = canonicalStringToBytes(canonicalJson);

      set({ pipelinePhase: "canonicalizing", canonicalContext });
      if (stepDelay) await sleep(stepDelay);

      set({ pipelinePhase: "signing" });
      const signResult = await defaultSignatureProvider.sign(canonicalBytes);
      if (stepDelay) await sleep(stepDelay);

      const packet: SignedTransactionPacket = {
        id: selectedIncomingRequest.requestId || `TX-${payload.sequence}`,
        payload,
        canonicalJson,
        contextHashHex: signResult.contextHashHex,
        signatureHex: signResult.signatureHex,
        algorithm: defaultSignatureProvider.algorithm,
        publicKeyHex: signResult.publicKeyHex,
      };

      set({ activePacket: packet, pipelinePhase: "verifying-signature" });
      if (stepDelay) await sleep(stepDelay);

      // 2. Gateway Guard Evaluations
      const { decision, guards } = await evaluateTransactionGateway(packet);

      // Guard 1: Authenticity
      set({
        guardStates: { signaturePassed: guards.signaturePassed, contextPassed: null, freshnessPassed: null },
      });
      if (stepDelay) await sleep(stepDelay);

      // Guard 2: Context
      set({
        pipelinePhase: "checking-context",
        guardStates: { signaturePassed: guards.signaturePassed, contextPassed: guards.contextPassed, freshnessPassed: null },
      });
      if (stepDelay) await sleep(stepDelay);

      // Guard 3: Freshness
      set({
        pipelinePhase: "checking-freshness",
        guardStates: { signaturePassed: guards.signaturePassed, contextPassed: guards.contextPassed, freshnessPassed: guards.freshnessPassed },
      });
      if (stepDelay) await sleep(stepDelay);

      // 3. Execution Outcome
      if (decision.status === "accepted") {
        set({
          operatorStage: "processed",
          pipelinePhase: "authorized",
          lifecycleState: "SUCCESS",
          baselineAuthorizedPacket: packet,
          lastDecision: decision,
          isProcessing: false,
        });

        get().auditEvents.unshift({
          id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toLocaleTimeString(),
          transactionId: packet.id,
          summary: `AUTHORIZED: ${packet.payload.message}`,
          status: "accepted",
          authenticity: "valid",
          execution: "authorized",
          ruleViolated: "NONE",
          reason: "Cryptographically authentic and fresh context",
          packet,
          decision,
        });
      } else {
        set({
          operatorStage: "blocked",
          pipelinePhase: "blocked",
          lifecycleState: "BLOCKED",
          lastDecision: decision,
          isProcessing: false,
        });

        get().auditEvents.unshift({
          id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toLocaleTimeString(),
          transactionId: packet.id,
          summary: `BLOCKED: ${decision.reason}`,
          status: decision.status,
          authenticity: decision.authenticity,
          execution: decision.execution,
          ruleViolated: decision.ruleViolated,
          reason: decision.reason,
          packet,
          decision,
        });
      }
    },

    triggerDuplicateArrival: () => {
      set({
        operatorStage: "duplicate-arrived",
        pipelinePhase: "idle",
        lifecycleState: "EMPTY",
        guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
      });
    },

    processDuplicate: async () => {
      const { baselineAuthorizedPacket, reducedMotion } = get();
      if (!baselineAuthorizedPacket) return;

      const stepDelay = reducedMotion ? 0 : 250;
      set({
        isProcessing: true,
        operatorStage: "duplicate-verifying",
        lifecycleState: "PROCESSING",
        pipelinePhase: "verifying-signature",
        activePacket: baselineAuthorizedPacket,
        guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
      });

      if (stepDelay) await sleep(stepDelay);

      // Re-evaluate the EXACT same packet
      const { decision, guards } = await evaluateTransactionGateway(baselineAuthorizedPacket);

      // Guard 1: Signature is STILL VALID
      set({
        guardStates: { signaturePassed: guards.signaturePassed, contextPassed: null, freshnessPassed: null },
      });
      if (stepDelay) await sleep(stepDelay);

      // Guard 2: Context is STILL VALID
      set({
        pipelinePhase: "checking-context",
        guardStates: { signaturePassed: guards.signaturePassed, contextPassed: guards.contextPassed, freshnessPassed: null },
      });
      if (stepDelay) await sleep(stepDelay);

      // Guard 3: Freshness FAILS (Reused Nonce!)
      set({
        pipelinePhase: "checking-freshness",
        guardStates: { signaturePassed: guards.signaturePassed, contextPassed: guards.contextPassed, freshnessPassed: guards.freshnessPassed },
      });
      if (stepDelay) await sleep(stepDelay);

      // Execution Gate: BLOCKED
      set({
        operatorStage: "blocked",
        pipelinePhase: "blocked",
        lifecycleState: "BLOCKED",
        lastDecision: decision,
        isProcessing: false,
      });

      get().auditEvents.unshift({
        id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString(),
        transactionId: baselineAuthorizedPacket.id,
        summary: `REPLAY BLOCKED: Duplicate request authorization already consumed`,
        status: "blocked",
        authenticity: "valid",
        execution: "blocked",
        ruleViolated: decision.ruleViolated,
        reason: decision.reason,
        packet: baselineAuthorizedPacket,
        decision,
      });
    },

    testInvalidScenario: async (scenarioId: string) => {
      const { baselineAuthorizedPacket, payload, reducedMotion } = get();
      const basePacket = baselineAuthorizedPacket || {
        id: `TX-${payload.sequence}`,
        payload,
        canonicalJson: canonicalizeJson(buildCanonicalContext(payload)),
        contextHashHex: "simulated_hash",
        signatureHex: "simulated_sig",
        algorithm: "ML-DSA-65",
        publicKeyHex: "pk_sim",
      };

      const scenario = INVALID_REQUEST_SCENARIOS.find((s) => s.id === scenarioId);
      if (!scenario) return;

      const mutatedPacket = scenario.applyMutation(basePacket);
      const stepDelay = reducedMotion ? 0 : 250;

      set({
        isProcessing: true,
        operatorStage: "invalid-test-verifying",
        lifecycleState: "PROCESSING",
        pipelinePhase: "verifying-signature",
        activePacket: mutatedPacket,
        guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
      });

      if (stepDelay) await sleep(stepDelay);

      const { decision, guards } = await evaluateTransactionGateway(mutatedPacket);

      // Step 1: Signature
      set({
        guardStates: { signaturePassed: guards.signaturePassed, contextPassed: null, freshnessPassed: null },
      });
      if (stepDelay) await sleep(stepDelay);

      // Step 2: Context
      if (guards.signaturePassed) {
        set({
          pipelinePhase: "checking-context",
          guardStates: { signaturePassed: true, contextPassed: guards.contextPassed, freshnessPassed: null },
        });
        if (stepDelay) await sleep(stepDelay);
      }

      // Step 3: Freshness
      if (guards.signaturePassed && guards.contextPassed) {
        set({
          pipelinePhase: "checking-freshness",
          guardStates: { signaturePassed: true, contextPassed: true, freshnessPassed: guards.freshnessPassed },
        });
        if (stepDelay) await sleep(stepDelay);
      }

      set({
        operatorStage: "blocked",
        pipelinePhase: "blocked",
        lifecycleState: "BLOCKED",
        lastDecision: decision,
        isProcessing: false,
      });

      get().auditEvents.unshift({
        id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString(),
        transactionId: mutatedPacket.id,
        summary: `BLOCKED: ${scenario.title} (${decision.reason})`,
        status: decision.status,
        authenticity: decision.authenticity,
        execution: decision.execution,
        ruleViolated: decision.ruleViolated,
        reason: decision.reason,
        packet: mutatedPacket,
        decision,
      });
    },

    resetToIncoming: () => {
      const { selectedIncomingRequest } = get();
      const lastSeq = defaultReplayStore.getLastSequence(selectedIncomingRequest.sessionId) ?? 104;
      const now = new Date();
      
      set({
        operatorStage: "incoming",
        pipelinePhase: "idle",
        lifecycleState: "EMPTY",
        guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
        lastDecision: null,
        payload: {
          ...get().payload,
          nonce: `N-${Math.floor(10000 + Math.random() * 90000)}`,
          sequence: lastSeq + 1,
          issuedAt: now.toISOString(),
          expiresAt: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
        },
      });
    },
  };
});
