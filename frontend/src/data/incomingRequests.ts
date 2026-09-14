import type { IncomingRequestItem } from "../types/transaction";

export const DEFAULT_INCOMING_REQUESTS: IncomingRequestItem[] = [
  {
    id: "tx-p2p",
    requestId: "TX-104",
    source: "Payment API (v2)",
    sender: "Alice",
    receiver: "Bob",
    amount: "₹10,000",
    message: "Transfer ₹10,000 to Bob",
    sessionId: "S-4821",
  },
  {
    id: "tx-vault",
    requestId: "TX-105",
    source: "Settlement Engine",
    sender: "treasury_agent_1",
    receiver: "cold_storage_vault",
    amount: "250,000 USDC",
    message: "Withdrawal: 250,000 USDC",
    sessionId: "S-9901",
  },
  {
    id: "tx-merchant",
    requestId: "TX-106",
    source: "Merchant Network",
    sender: "hot_wallet_corp",
    receiver: "merchant_gateway",
    amount: "₹45,500",
    message: "Merchant Settlement ₹45,500",
    sessionId: "S-4821",
  },
];

export interface InvalidRequestScenario {
  id: string;
  title: string;
  description: string;
  expectedInvariant: string;
  applyMutation: (packet: any) => any;
}

export const INVALID_REQUEST_SCENARIOS: InvalidRequestScenario[] = [
  {
    id: "tamper-message",
    title: "Modified Transaction Payload",
    description: "Transaction message or amount is modified in transit after signing.",
    expectedInvariant: "Signature Guard detects SHA-256 context hash mismatch. ML-DSA-65 signature invalid.",
    applyMutation: (packet) => ({
      ...packet,
      tamperedMessage: "Transfer ₹1,000,000 to Mallory (Altered in Transit)",
    }),
  },
  {
    id: "tamper-session",
    title: "Session ID Substitution",
    description: "Request attempts to execute under an unauthorized or swapped session context.",
    expectedInvariant: "Context Guard detects session binding mismatch. Context rejected.",
    applyMutation: (packet) => ({
      ...packet,
      tamperedSessionId: "S-ROGUE-9999",
    }),
  },
  {
    id: "expired-ttl",
    title: "Expired Request Window (TTL)",
    description: "Request timestamp arrives past the maximum allowable execution window.",
    expectedInvariant: "Freshness Guard rejects expired request timestamp (TTL window exceeded).",
    applyMutation: (packet) => ({
      ...packet,
      payload: {
        ...packet.payload,
        expiresAt: new Date(Date.now() - 120000).toISOString(),
      },
    }),
  },
  {
    id: "sequence-gap",
    title: "Monotonic Sequence Violation",
    description: "Transaction skips sequence numbers or arrives out of order.",
    expectedInvariant: "Freshness Guard enforces strict monotonic sequence (sequence !== lastSeq + 1).",
    applyMutation: (packet) => ({
      ...packet,
      payload: {
        ...packet.payload,
        sequence: packet.payload.sequence + 50,
      },
    }),
  },
];
