import { create } from "zustand";
import type {
  SignedTransactionPacket,
  CanonicalContext,
  PipelinePhase,
  LifecycleState,
  SecurityDecision,
  SecurityStatus,
  ThemeMode,
  OperatorViewMode,
  ActiveNavTab,
  OperatorUser,
  InboxTransactionItem,
} from "../types/transaction";
import { buildCanonicalContext, canonicalizeJson } from "../engine/canonicalize";
import { defaultReplayStore } from "../engine/replayGuard";
import { evaluateTransactionGateway } from "../engine/decisionEngine";
import initialTransactionsData from "../data/transactions.json";

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
  // Auth State
  isAuthenticated: boolean;
  currentUser: OperatorUser;
  loginDemo: () => void;
  logout: () => void;

  theme: ThemeMode;
  activeTab: ActiveNavTab;
  
  // Transaction Inbox & Review State
  inboxItems: InboxTransactionItem[];
  selectedTransaction: InboxTransactionItem | null;
  operatorViewMode: OperatorViewMode;
  inboxFilter: "all" | "pending" | "authorized" | "blocked";

  // Active Verification Packet & Cryptographic State
  activePacket: SignedTransactionPacket | null;
  canonicalContext: CanonicalContext | null;
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
  setInboxFilter: (filter: "all" | "pending" | "authorized" | "blocked") => void;
  selectTransactionForReview: (item: InboxTransactionItem) => void;
  returnToInbox: () => void;
  setReducedMotion: (enabled: boolean) => void;

  // Evidence Drawer Actions
  openEvidenceSheet: (packet?: SignedTransactionPacket, decision?: SecurityDecision) => void;
  closeEvidenceSheet: () => void;

  // Execution Workflow
  verifyAndExecute: () => Promise<void>;
  resetInbox: () => void;
}

function getInitialTheme(): ThemeMode {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("q-signguard-theme") as ThemeMode | null;
    if (saved === "light" || saved === "dark") return saved;
  }
  return "light";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_OPERATOR: OperatorUser = {
  name: "Alice M.",
  email: "sec_ops_alice@qsignguard.internal",
  role: "Security Operations Engineer",
  enclave: "Asia-South-1 Enclave",
};

export const useSecurityStore = create<SecurityStoreState>((set, get) => {
  const initialItems = JSON.parse(JSON.stringify(initialTransactionsData)) as InboxTransactionItem[];

  return {
    isAuthenticated: false,
    currentUser: DEFAULT_OPERATOR,
    loginDemo: () =>
      set({
        isAuthenticated: true,
        activeTab: "transactions",
        operatorViewMode: "inbox",
      }),
    logout: () => set({ isAuthenticated: false }),

    theme: getInitialTheme(),
    activeTab: "transactions",

    inboxItems: initialItems,
    selectedTransaction: null,
    operatorViewMode: "inbox",
    inboxFilter: "all",

    activePacket: null,
    canonicalContext: null,
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

    setActiveTab: (activeTab) => {
      set({ activeTab });
      if (activeTab === "transactions") {
        // Return to inbox when navigating to transactions
        set({ operatorViewMode: "inbox" });
      }
    },

    setInboxFilter: (inboxFilter) => set({ inboxFilter }),

    selectTransactionForReview: (item) => {
      set({
        selectedTransaction: item,
        operatorViewMode: "review",
        guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
        lastDecision: null,
      });
    },

    returnToInbox: () => {
      set({
        operatorViewMode: "inbox",
        selectedTransaction: null,
        activePacket: null,
        guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
      });
    },

    setReducedMotion: (reducedMotion) => set({ reducedMotion }),

    openEvidenceSheet: (packet, decision) => {
      const p = packet || get().activePacket;
      const d = decision || get().lastDecision;
      set({
        evidenceDrawerOpen: true,
        activeEvidencePacket: p,
        activeEvidenceDecision: d,
      });
    },

    closeEvidenceSheet: () => set({ evidenceDrawerOpen: false }),

    verifyAndExecute: async () => {
      const { selectedTransaction, reducedMotion } = get();
      if (!selectedTransaction) return;

      const stepDelay = reducedMotion ? 0 : 300;

      set({
        isProcessing: true,
        operatorViewMode: "corridor",
        lifecycleState: "PROCESSING",
        pipelinePhase: "collecting",
        guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
      });

      // 1. Build Canonical Context from the incoming packet
      const payload = {
        message: selectedTransaction.transaction.message,
        sender: selectedTransaction.transaction.sender,
        receiver: selectedTransaction.transaction.receiver,
        sessionId: selectedTransaction.securityContext.sessionId,
        nonce: selectedTransaction.securityContext.nonce,
        sequence: selectedTransaction.securityContext.sequence,
        issuedAt: selectedTransaction.securityContext.issuedAt,
        expiresAt: selectedTransaction.securityContext.expiresAt,
      };

      const canonicalContext = buildCanonicalContext(payload);
      const canonicalJson = canonicalizeJson(canonicalContext);

      set({ pipelinePhase: "canonicalizing", canonicalContext });
      if (stepDelay) await sleep(stepDelay);

      // Packet with attached signature from the incoming request
      const packet: SignedTransactionPacket = {
        id: selectedTransaction.requestId,
        payload,
        canonicalJson,
        contextHashHex: selectedTransaction.signature.contextHashHex,
        signatureHex: selectedTransaction.signature.signatureHex,
        algorithm: selectedTransaction.signature.algorithm,
        publicKeyHex: selectedTransaction.signature.publicKeyHex,
        publicKeyFingerprint: selectedTransaction.signature.publicKeyFingerprint,
      };

      set({ activePacket: packet, pipelinePhase: "verifying-signature" });
      if (stepDelay) await sleep(stepDelay);

      // 2. Gateway Security Guard Evaluation
      const { decision, guards } = await evaluateTransactionGateway(packet);

      // Step A: Authenticity Guard
      set({
        guardStates: { signaturePassed: guards.signaturePassed, contextPassed: null, freshnessPassed: null },
      });
      if (stepDelay) await sleep(stepDelay);

      // Step B: Context Guard
      if (guards.signaturePassed) {
        set({
          pipelinePhase: "checking-context",
          guardStates: { signaturePassed: true, contextPassed: guards.contextPassed, freshnessPassed: null },
        });
        if (stepDelay) await sleep(stepDelay);
      }

      // Step C: Freshness Guard
      if (guards.signaturePassed && guards.contextPassed) {
        set({
          pipelinePhase: "checking-freshness",
          guardStates: { signaturePassed: true, contextPassed: true, freshnessPassed: guards.freshnessPassed },
        });
        if (stepDelay) await sleep(stepDelay);
      }

      // 3. Execution Decision
      const isAccepted = decision.status === "accepted";
      const updatedStatus = isAccepted ? ("authorized" as const) : ("blocked" as const);

      const updatedItem: InboxTransactionItem = {
        ...selectedTransaction,
        reviewStatus: updatedStatus,
        evaluatedDecision: decision,
      };

      const updatedInbox = get().inboxItems.map((item) =>
        item.requestId === selectedTransaction.requestId ? updatedItem : item
      );

      set({
        inboxItems: updatedInbox,
        selectedTransaction: updatedItem,
        operatorViewMode: "receipt",
        pipelinePhase: isAccepted ? "authorized" : "blocked",
        lifecycleState: isAccepted ? "SUCCESS" : "BLOCKED",
        lastDecision: decision,
        isProcessing: false,
      });

      // Append to audit events
      get().auditEvents.unshift({
        id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString(),
        transactionId: packet.id,
        summary: isAccepted
          ? `AUTHORIZED: ${packet.payload.message}`
          : `BLOCKED: ${decision.reason}`,
        status: decision.status,
        authenticity: decision.authenticity,
        execution: decision.execution,
        ruleViolated: decision.ruleViolated,
        reason: decision.reason,
        packet,
        decision,
      });
    },

    resetInbox: () => {
      defaultReplayStore.reset();
      const freshItems = JSON.parse(JSON.stringify(initialTransactionsData)) as InboxTransactionItem[];
      set({
        inboxItems: freshItems,
        selectedTransaction: null,
        operatorViewMode: "inbox",
        activePacket: null,
        lastDecision: null,
        guardStates: { signaturePassed: null, contextPassed: null, freshnessPassed: null },
      });
    },
  };
});
