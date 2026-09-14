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
  publicKeyFingerprint?: string;
  tamperedMessage?: string;
  tamperedSessionId?: string;
  fixtureCondition?: FixtureCondition;
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
  | "authorized"
  | "duplicate-arrived"
  | "duplicate-verifying"
  | "blocked";

export type OperatorViewMode =
  | "inbox"
  | "review"
  | "corridor"
  | "receipt";

export type ActiveNavTab = "transactions" | "events" | "system";

export interface OperatorUser {
  name: string;
  email: string;
  role: string;
  enclave: string;
}

export type FixtureCondition =
  | "legitimate"
  | "replay"
  | "tampered"
  | "expired"
  | "sequenceViolation"
  | "contextViolation";

export interface SignatureMetadata {
  algorithm: string;
  status: "valid" | "invalid";
  publicKeyFingerprint: string;
  publicKeyHex: string;
  signatureHex: string;
  contextHashHex: string;
}

export interface InboxTransactionItem {
  requestId: string;
  receivedAt: string;
  source: string;
  transaction: {
    sender: string;
    receiver: string;
    amount: number;
    currency: string;
    formattedAmount: string;
    message: string;
  };
  securityContext: {
    sessionId: string;
    nonce: string;
    sequence: number;
    issuedAt: string;
    expiresAt: string;
  };
  signature: SignatureMetadata;
  fixtureCondition: FixtureCondition;
  reviewStatus: "pending" | "authorized" | "blocked";
  evaluatedDecision?: SecurityDecision;
}

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
