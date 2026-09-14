export type SecurityStatus =
  | "accepted"
  | "degraded"
  | "suspicious"
  | "blocked"
  | "unknown";

export type AuthenticityStatus = "valid" | "invalid";
export type ExecutionStatus = "authorized" | "blocked";

export type SecurityRuleCode =
  | "REPLAY_NONCE_REUSED"
  | "SEQUENCE_OUT_OF_ORDER"
  | "CONTEXT_EXPIRED"
  | "SIGNATURE_MISMATCH"
  | "SESSION_INVALID"
  | "NONE";

export interface EvidenceItem {
  id: string;
  label: string;
  status: "pass" | "fail" | "warn";
  observed: string;
  expected: string;
  description: string;
}

export interface SecurityDecision {
  status: SecurityStatus;
  authenticity: AuthenticityStatus;
  execution: ExecutionStatus;
  reason: string;
  ruleViolated: SecurityRuleCode;
  evidence: EvidenceItem[];
  simulationLatencyMs: number;
  evaluatedAt: string;
}

export interface TransactionPayload {
  message: string;
  sender: string;
  receiver: string;
  sessionId: string;
  nonce: string;
  sequence: number;
  issuedAt: string;  // ISO 8601 UTC
  expiresAt: string; // ISO 8601 UTC
}

export interface CanonicalContext {
  expires_at: string;
  issued_at: string;
  message: string;
  nonce: string;
  receiver: string;
  sender: string;
  sequence: number;
  session_id: string;
}

export interface SignedTransactionPacket {
  id: string;
  payload: TransactionPayload;
  canonicalJson: string;
  contextHashHex: string;
  signatureHex: string;
  algorithm: string;
  publicKeyHex: string;
  tamperedMessage?: string;
  tamperedSessionId?: string;
}

export type PipelinePhase =
  | "idle"
  | "collecting"
  | "canonicalizing"
  | "signing"
  | "transmitting"
  | "verifying-signature"
  | "checking-context"
  | "checking-freshness"
  | "authorized"
  | "blocked"
  | "error";

export type LifecycleState =
  | "EMPTY"
  | "PROCESSING"
  | "SUCCESS"
  | "BLOCKED"
  | "UNKNOWN"
  | "ERROR";

export type ThemeMode = "light" | "dark";

export type OperatorStage =
  | "incoming"
  | "verifying"
  | "processed"
  | "duplicate-arrived"
  | "duplicate-verifying"
  | "blocked"
  | "invalid-test-verifying";

export type ActiveNavTab = "protect" | "learn" | "activity";

export interface IncomingRequestItem {
  id: string;
  requestId: string;
  source: string;
  sender: string;
  receiver: string;
  amount: string;
  message: string;
  sessionId: string;
}

