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
} from "../types/transaction";
import { buildCanonicalContext, canonicalizeJson, canonicalStringToBytes } from "../engine/canonicalize";
import { defaultSignatureProvider } from "../engine/signatureProvider";
import { defaultReplayStore } from "../engine/replayGuard";
import { evaluateTransactionGateway } from "../engine/decisionEngine";
import { ATTACK_SCENARIOS } from "../data/scenarios";

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
  activeTab: "console" | "attacks" | "audit" | "research";
  payload: TransactionPayload;
  canonicalContext: CanonicalContext | null;
  activePacket: SignedTransactionPacket | null;
  baselineAuthorizedPacket: SignedTransactionPacket | null;
  pipelinePhase: PipelinePhase;
  lifecycleState: LifecycleState;
  guardStates: {
    signaturePassed: boolean | null;
    contextPassed: boolean | null;
    freshnessPassed: boolean | null;
  };
  lastDecision: SecurityDecision | null;
  auditEvents: AuditEvent[];
  selectedScenarioId: string;
  isProcessing: boolean;
  reducedMotion: boolean;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  setActiveTab: (tab: "console" | "attacks" | "audit" | "research") => void;
  updatePayload: (partial: Partial<TransactionPayload>) => void;
  randomizeTransaction: () => void;
  generateAndSign: () => Promise<SignedTransactionPacket>;
  executePipeline: (packet: SignedTransactionPacket) => Promise<SecurityDecision>;
  replayBaseline: () => Promise<void>;
  selectScenario: (scenarioId: string) => void;
  launchScenario: (scenarioId: string) => Promise<void>;
  resetReplayStore: () => void;
  setReducedMotion: (enabled: boolean) => void;
}

const DEFAULT_PAYLOAD: TransactionPayload = {
  message: "Transfer ₹10,000 to Bob",
  sender: "Alice",
  receiver: "Bob",
  sessionId: "S-4821",
  nonce: "N-88321",
  sequence: 104,
  issuedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
};

function getInitialTheme(): ThemeMode {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("q-signguard-theme") as ThemeMode | null;
    if (saved === "light" || saved === "dark") return saved;
  }
  return "light"; // Default to light mode
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useSecurityStore = create<SecurityStoreState>((set, get) => ({
  theme: getInitialTheme(),
  activeTab: "console",
  payload: DEFAULT_PAYLOAD,
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
  selectedScenarioId: "replay_attack",
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

  setReducedMotion: (reducedMotion) => set({ reducedMotion }),

  updatePayload: (partial) => {
    const newPayload = { ...get().payload, ...partial };
    set({ payload: newPayload });
  },

  randomizeTransaction: () => {
    const randomNonce = `N-${Math.floor(10000 + Math.random() * 90000)}`;
    const lastSeq = defaultReplayStore.getLastSequence("S-4821") ?? 103;
    const now = new Date();
    set({
      payload: {
        ...get().payload,
        nonce: randomNonce,
        sequence: lastSeq + 1,
        issuedAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
      },
    });
  },

  generateAndSign: async () => {
    const { payload, reducedMotion } = get();
    const delay = reducedMotion ? 0 : 250;

    set({
      isProcessing: true,
      lifecycleState: "PROCESSING",
      pipelinePhase: "collecting",
      guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
    });

    if (delay) await sleep(delay);

    const canonicalContext = buildCanonicalContext(payload);
    const canonicalJson = canonicalizeJson(canonicalContext);
    const canonicalBytes = canonicalStringToBytes(canonicalJson);

    set({ pipelinePhase: "canonicalizing", canonicalContext });
    if (delay) await sleep(delay);

    set({ pipelinePhase: "signing" });
    const signResult = await defaultSignatureProvider.sign(canonicalBytes);
    if (delay) await sleep(delay);

    const packetId = `TX-${payload.sequence}`;
    const packet: SignedTransactionPacket = {
      id: packetId,
      payload,
      canonicalJson,
      contextHashHex: signResult.contextHashHex,
      signatureHex: signResult.signatureHex,
      algorithm: defaultSignatureProvider.algorithm,
      publicKeyHex: signResult.publicKeyHex,
    };

    set({
      activePacket: packet,
      pipelinePhase: "transmitting",
      isProcessing: false,
    });

    return packet;
  },

  executePipeline: async (packet: SignedTransactionPacket) => {
    const { reducedMotion } = get();
    const delay = reducedMotion ? 0 : 350;

    set({
      isProcessing: true,
      lifecycleState: "PROCESSING",
      pipelinePhase: "verifying-signature",
      activePacket: packet,
      guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
    });

    if (delay) await sleep(delay);

    const { decision, guards } = await evaluateTransactionGateway(packet);

    // Step 1: Signature Guard
    set({
      guardStates: {
        signaturePassed: guards.signaturePassed,
        contextPassed: null,
        freshnessPassed: null,
      },
    });

    if (!guards.signaturePassed) {
      if (delay) await sleep(delay);
      set({
        pipelinePhase: "blocked",
        lifecycleState: "BLOCKED",
        lastDecision: decision,
        isProcessing: false,
      });
      get().auditEvents.unshift({
        id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString(),
        transactionId: packet.id,
        summary: `BLOCKED: Signature Tampering Detected`,
        status: decision.status,
        authenticity: decision.authenticity,
        execution: decision.execution,
        ruleViolated: decision.ruleViolated,
        reason: decision.reason,
        packet,
        decision,
      });
      return decision;
    }

    // Step 2: Context Guard
    set({ pipelinePhase: "checking-context" });
    if (delay) await sleep(delay);

    set({
      guardStates: {
        signaturePassed: true,
        contextPassed: guards.contextPassed,
        freshnessPassed: null,
      },
    });

    if (!guards.contextPassed) {
      if (delay) await sleep(delay);
      set({
        pipelinePhase: "blocked",
        lifecycleState: "BLOCKED",
        lastDecision: decision,
        isProcessing: false,
      });
      get().auditEvents.unshift({
        id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString(),
        transactionId: packet.id,
        summary: `BLOCKED: Context / Session Invalid`,
        status: decision.status,
        authenticity: decision.authenticity,
        execution: decision.execution,
        ruleViolated: decision.ruleViolated,
        reason: decision.reason,
        packet,
        decision,
      });
      return decision;
    }

    // Step 3: Freshness & Replay Guard
    set({ pipelinePhase: "checking-freshness" });
    if (delay) await sleep(delay);

    set({
      guardStates: {
        signaturePassed: true,
        contextPassed: true,
        freshnessPassed: guards.freshnessPassed,
      },
    });

    if (delay) await sleep(delay);

    if (decision.status === "accepted") {
      set({
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
        summary: `AUTHORIZED: Authenticated & Fresh (${packet.payload.message})`,
        status: "accepted",
        authenticity: "valid",
        execution: "authorized",
        ruleViolated: "NONE",
        reason: decision.reason,
        packet,
        decision,
      });
    } else {
      set({
        pipelinePhase: "blocked",
        lifecycleState: "BLOCKED",
        lastDecision: decision,
        isProcessing: false,
      });
      get().auditEvents.unshift({
        id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString(),
        transactionId: packet.id,
        summary: `BLOCKED: ${decision.ruleViolated} (${decision.reason})`,
        status: decision.status,
        authenticity: decision.authenticity,
        execution: decision.execution,
        ruleViolated: decision.ruleViolated,
        reason: decision.reason,
        packet,
        decision,
      });
    }

    return decision;
  },

  replayBaseline: async () => {
    let packetToReplay = get().baselineAuthorizedPacket;
    if (!packetToReplay) {
      const generated = await get().generateAndSign();
      await get().executePipeline(generated);
      packetToReplay = get().baselineAuthorizedPacket;
    }

    if (packetToReplay) {
      await get().executePipeline({ ...packetToReplay });
    }
  },

  selectScenario: (selectedScenarioId) => set({ selectedScenarioId }),

  launchScenario: async (scenarioId: string) => {
    const scenario = ATTACK_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    let base = get().baselineAuthorizedPacket;
    if (!base) {
      const generated = await get().generateAndSign();
      if (scenario.id === "normal_baseline") {
        await get().executePipeline(generated);
        return;
      }
      await get().executePipeline(generated);
      base = get().baselineAuthorizedPacket;
    }

    if (base) {
      const attackPacket = scenario.generatePacket(base);
      await get().executePipeline(attackPacket);
    }
  },

  resetReplayStore: () => {
    defaultReplayStore.reset();
    set({
      activePacket: null,
      baselineAuthorizedPacket: null,
      canonicalContext: null,
      pipelinePhase: "idle",
      lifecycleState: "EMPTY",
      guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
      lastDecision: null,
    });
  },
}));
