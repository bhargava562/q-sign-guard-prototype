import type { SecurityDecision, SignedTransactionPacket } from "../types/transaction";

export interface AnalystExplanation {
  assessment: string;
  risk: "HIGH" | "MEDIUM" | "LOW";
  confidence: "High" | "Medium" | "Low";
  reasoning: string[];
  recommendation: "REJECT" | "APPROVE";
  summary: string;
}

export interface PresetQuestionAnswer {
  id: string;
  question: string;
  answer: string;
}

export function generateAnalystAssessment(
  decision: SecurityDecision,
  packet?: SignedTransactionPacket | null
): AnalystExplanation {
  const nonce = packet?.payload.nonce || "N-88321";
  const session = packet?.payload.sessionId || "S-4821";
  const seq = packet?.payload.sequence ?? 104;

  if (decision.ruleViolated === "REPLAY_NONCE_REUSED") {
    return {
      assessment: "Likely Replay Attack",
      risk: "HIGH",
      confidence: "High",
      reasoning: [
        "ML-DSA-65 signature is mathematically valid and originates from the authenticated sender.",
        `Nonce '${nonce}' in session '${session}' was already committed by a prior transaction.`,
        `Sequence '${seq}' has already been processed and finalized in the ledger.`,
        "Cryptographic authenticity is verified, but replay freshness invariant is violated.",
      ],
      recommendation: "REJECT",
      summary:
        "This transaction carries a genuine digital signature, but the authorization has already been executed and consumed. Re-executing it would duplicate fund settlement.",
    };
  }

  if (decision.ruleViolated === "SIGNATURE_MISMATCH") {
    return {
      assessment: "Possible Payload Tampering in Transit",
      risk: "HIGH",
      confidence: "High",
      reasoning: [
        "Received payload content does not match the signed canonical digest.",
        "Post-quantum ML-DSA-65 verification failed over the canonical context.",
        "The message, amount, or recipient was altered in transit without the signer's private key.",
      ],
      recommendation: "REJECT",
      summary:
        "The signature failed verification. Either the transaction payload was maliciously modified in transit, or the packet was signed with an unauthorized key.",
    };
  }

  if (decision.ruleViolated === "SESSION_INVALID") {
    return {
      assessment: "Unauthorized or Revoked Session Context",
      risk: "HIGH",
      confidence: "High",
      reasoning: [
        "Signer possesses a valid key, but the requested session context is revoked or unauthenticated.",
        `Session '${session}' is not active in the gateway's stateful policy registry.`,
        "Participant is attempting execution outside permitted authorization boundaries.",
      ],
      recommendation: "REJECT",
      summary:
        "While the signature is authentic to the signer, the associated session is revoked or not authorized for this recipient.",
    };
  }

  if (decision.ruleViolated === "CONTEXT_EXPIRED") {
    return {
      assessment: "Stale Transaction Window (TTL Exceeded)",
      risk: "MEDIUM",
      confidence: "High",
      reasoning: [
        "Signature and session context are authentic and recognized.",
        "The allowable time window (TTL) elapsed before arrival at the gateway.",
        "Delayed transmission or stale packet delivery poses state desynchronization risks.",
      ],
      recommendation: "REJECT",
      summary:
        "The transaction is authentic, but its validity window expired prior to gateway evaluation. Stale authorizations cannot be safely settled.",
    };
  }

  if (decision.ruleViolated === "SEQUENCE_OUT_OF_ORDER") {
    return {
      assessment: "Monotonic Sequence Invariant Violation",
      risk: "HIGH",
      confidence: "High",
      reasoning: [
        "The transaction sequence number does not follow strict monotonic progression (expected sequence = last + 1).",
        "Out-of-order sequence indicates dropped packets, race conditions, or packet injection.",
      ],
      recommendation: "REJECT",
      summary:
        "Monotonic order violation. Accepting out-of-order requests would corrupt the session replay ledger.",
    };
  }

  // Accepted / Authorized
  return {
    assessment: "No Security Violation Detected",
    risk: "LOW",
    confidence: "High",
    reasoning: [
      "ML-DSA-65 post-quantum signature is valid and verified against canonical context.",
      "Sender identity, recipient account, and session token are active and authorized.",
      "Nonce is fresh and has never been executed in this session.",
      "Sequence strictly follows monotonic ledger ordering.",
    ],
    recommendation: "APPROVE",
    summary:
      "All protocol invariants passed. Cryptographic authenticity, contextual binding, and temporal freshness are confirmed.",
  };
}

export function getPresetQuestions(
  decision: SecurityDecision,
  packet?: SignedTransactionPacket | null
): PresetQuestionAnswer[] {
  const nonce = packet?.payload.nonce || "N-88321";
  const session = packet?.payload.sessionId || "S-4821";
  const isReplay = decision.ruleViolated === "REPLAY_NONCE_REUSED";
  const isTamper = decision.ruleViolated === "SIGNATURE_MISMATCH";
  const isAccepted = decision.status === "accepted";

  return [
    {
      id: "q1_why_blocked",
      question: isAccepted ? "Why was this authorized?" : "Why was this blocked?",
      answer: isAccepted
        ? "The gateway verified that the ML-DSA-65 signature is authentic, the session context is active, and the nonce is fresh. All 4 protocol gates passed."
        : isReplay
        ? `The signature is valid, but this transaction uses nonce '${nonce}', which was already consumed in session '${session}'. The gateway enforces strict stateful freshness.`
        : decision.reason,
    },
    {
      id: "q2_signature_valid",
      question: "Is the cryptographic signature valid?",
      answer: isTamper
        ? "No. The signature verification failed because the payload bytes differ from what was originally signed."
        : "Yes. The post-quantum ML-DSA-65 signature is mathematically valid and was signed by the registered key.",
    },
    {
      id: "q3_replayed",
      question: "Was this request replayed?",
      answer: isReplay
        ? `Yes. The exact nonce '${nonce}' was committed in a previous transaction. An attacker or duplicate network transmission attempted to re-execute the authorization.`
        : "No duplicate nonce was detected for this transaction context.",
    },
    {
      id: "q4_evidence",
      question: "What evidence supports this decision?",
      answer: isAccepted
        ? "Deterministic RFC 8785 canonical hash matching the signature, verified signer public certificate, active session token, and unseen nonce."
        : `Gateway Replay Store inspection: observed state shows Nonce '${nonce}' registered in consumed table. Decision rule: ${decision.ruleViolated}.`,
    },
    {
      id: "q5_override_risks",
      question: "What should I check before overriding?",
      answer: isAccepted
        ? "No override needed: the transaction is safe to settle."
        : isReplay
        ? "CAUTION: Overriding will disburse funds a second time for the same authorization! Confirm whether the client intended a duplicate transfer under a fresh nonce."
        : "Verify that the signer re-issues a new transaction with a fresh signature and context token through an authenticated enclave channel.",
    },
  ];
}
