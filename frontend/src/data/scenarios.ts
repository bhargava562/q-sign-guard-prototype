import type { AttackScenario } from "../types/scenario";
import type { SignedTransactionPacket } from "../types/transaction";

export const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: "normal_baseline",
    category: "BASELINE",
    name: "Normal Transaction",
    badge: "BASELINE",
    shortDescription: "Valid signature, authorized context, fresh nonce, correctly sequenced.",
    attackerIntent: "Legitimate user executing an authorized transaction for the first time.",
    attackerAction: "Dispatches a freshly signed transaction with valid session and sequence.",
    expectedAuthenticity: "valid",
    expectedExecution: "authorized",
    expectedRule: "NONE",
    whyExplanation:
      "All three gateway layers pass: cryptographic signature verified, session is active, and the nonce/sequence are fresh and unconsumed.",
    generatePacket: (base: SignedTransactionPacket) => ({
      ...base,
    }),
  },
  {
    id: "replay_attack",
    category: "ATTACKS",
    name: "Replay Attack (Hero Demo)",
    badge: "HERO EXPLOIT",
    shortDescription:
      "Captured legitimate transaction re-sent without modification. Signature is 100% valid, but context is already consumed.",
    attackerIntent:
      "Duplicate execution of a valid transaction (e.g. repeated withdrawal attack like the 2026 ICON incident).",
    attackerAction:
      "Re-injects the identical signed transaction packet into the gateway without breaking any cryptography.",
    expectedAuthenticity: "valid",
    expectedExecution: "blocked",
    expectedRule: "REPLAY_NONCE_REUSED",
    whyExplanation:
      "The digital signature remains cryptographically authentic, but the gateway rejects execution because the signed nonce and sequence have already been consumed.",
    generatePacket: (base: SignedTransactionPacket) => ({
      ...base,
      // Keeps same nonce and sequence, perfectly valid signature
    }),
  },
  {
    id: "message_tampering",
    category: "ATTACKS",
    name: "Message Tampering",
    badge: "INTEGRITY",
    shortDescription: "Attacker modifies payment amount/payload in transit.",
    attackerIntent: "Alter transaction payload to divert funds or increase transfer amount.",
    attackerAction:
      "Modifies payload from 'Transfer ₹10,000 to Bob' to 'Transfer ₹500,000 to Eve'. Signature cannot match.",
    expectedAuthenticity: "invalid",
    expectedExecution: "blocked",
    expectedRule: "SIGNATURE_MISMATCH",
    whyExplanation:
      "Signature verification fails at Guard 1 because the SHA-256 hash of the canonical context does not match the signed hash.",
    generatePacket: (base: SignedTransactionPacket) => ({
      ...base,
      tamperedMessage: "Transfer ₹500,000 to Eve [MALICIOUS TAMPER]",
    }),
  },
  {
    id: "context_tampering",
    category: "CONTEXT_ABUSE",
    name: "Context Tampering",
    badge: "SESSION BIND",
    shortDescription: "Attacker substitutes or tampers with the session binding identifier.",
    attackerIntent: "Execute authorization under a different or hijacked session context.",
    attackerAction: "Alters session ID to 'S-MALICIOUS-999' while keeping original signature.",
    expectedAuthenticity: "invalid",
    expectedExecution: "blocked",
    expectedRule: "SIGNATURE_MISMATCH",
    whyExplanation:
      "Because the session ID is strictly bound within the canonical context, altering it changes the canonical representation and invalidates the ML-DSA signature.",
    generatePacket: (base: SignedTransactionPacket) => ({
      ...base,
      tamperedSessionId: "S-MALICIOUS-999",
    }),
  },
  {
    id: "expired_context",
    category: "CONTEXT_ABUSE",
    name: "Expired Context",
    badge: "FRESHNESS",
    shortDescription: "Transaction arrives outside the valid time-to-live execution window.",
    attackerIntent: "Delay or re-inject a stale signed authorization hours after authorization.",
    attackerAction: "Sends a validly signed transaction whose 'expires_at' timestamp is in the past.",
    expectedAuthenticity: "valid",
    expectedExecution: "blocked",
    expectedRule: "CONTEXT_EXPIRED",
    whyExplanation:
      "Signature is valid, but the freshness guard rejects the transaction because the current gateway time exceeds expires_at + clock tolerance.",
    generatePacket: (base: SignedTransactionPacket) => ({
      ...base,
      payload: {
        ...base.payload,
        issuedAt: new Date(Date.now() - 3600000).toISOString(),
        expiresAt: new Date(Date.now() - 1800000).toISOString(),
      },
    }),
  },
  {
    id: "sequence_violation",
    category: "CONTEXT_ABUSE",
    name: "Sequence Violation",
    badge: "MONOTONIC",
    shortDescription: "Transaction arrives out of order or skips expected monotonic sequence number.",
    attackerIntent: "Front-run transactions, inject stale sequences, or bypass intermediate approvals.",
    attackerAction: "Submits sequence 199 when the session sequence expects sequence 104.",
    expectedAuthenticity: "valid",
    expectedExecution: "blocked",
    expectedRule: "SEQUENCE_OUT_OF_ORDER",
    whyExplanation:
      "The gateway enforces strict monotonic ordering (sequence === lastSequence + 1) per session. Sequence gaps or regressions are blocked.",
    generatePacket: (base: SignedTransactionPacket) => ({
      ...base,
      payload: {
        ...base.payload,
        sequence: 199,
      },
    }),
  },
];
