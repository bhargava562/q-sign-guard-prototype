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
  applyMutation: (packet: any) => Promise<any> | any;
}

export const INVALID_REQUEST_SCENARIOS: InvalidRequestScenario[] = [
  {
    id: "tamper-message",
    title: "Tampered Payload in Transit",
    description: "Transaction message altered in transit without signer's private key.",
    expectedInvariant: "Signature FAIL: ML-DSA-65 verification fails due to SHA-256 context hash mismatch.",
    applyMutation: (packet) => ({
      ...packet,
      tamperedMessage: "Transfer ₹1,000,000 to Mallory (Altered in Transit)",
    }),
  },
  {
    id: "unauthorized-context",
    title: "Unauthorized Session Context (Valid Signature)",
    description: "Signer genuinely signed this context, but session S-REVOKED-44 is revoked in gateway policy.",
    expectedInvariant: "Signature PASS, Context FAIL: Cryptographic signature is valid, but session context is unauthenticated.",
    applyMutation: async (packet) => {
      // Import on the fly or build context with revoked session and genuine signature
      const { buildCanonicalContext, canonicalizeJson, canonicalStringToBytes } = await import("../engine/canonicalize");
      const { defaultSignatureProvider } = await import("../engine/signatureProvider");
      
      const payloadWithRevokedSession = {
        ...packet.payload,
        sessionId: "S-REVOKED-44",
      };
      const canonicalCtx = buildCanonicalContext(payloadWithRevokedSession);
      const canonicalJson = canonicalizeJson(canonicalCtx);
      const canonicalBytes = canonicalStringToBytes(canonicalJson);
      const signResult = await defaultSignatureProvider.sign(canonicalBytes);

      return {
        ...packet,
        payload: payloadWithRevokedSession,
        canonicalJson,
        contextHashHex: signResult.contextHashHex,
        signatureHex: signResult.signatureHex,
        publicKeyHex: signResult.publicKeyHex,
        tamperedMessage: undefined,
        tamperedSessionId: undefined,
      };
    },
  },
  {
    id: "expired-ttl",
    title: "Expired Validity Window (TTL)",
    description: "Signer signed valid request, but validity window has elapsed before arrival at gateway.",
    expectedInvariant: "Signature PASS, Context PASS, Freshness FAIL: Request timestamp expired.",
    applyMutation: async (packet) => {
      const { buildCanonicalContext, canonicalizeJson, canonicalStringToBytes } = await import("../engine/canonicalize");
      const { defaultSignatureProvider } = await import("../engine/signatureProvider");

      const expiredPayload = {
        ...packet.payload,
        expiresAt: new Date(Date.now() - 300000).toISOString(), // expired 5 mins ago
      };
      const canonicalCtx = buildCanonicalContext(expiredPayload);
      const canonicalJson = canonicalizeJson(canonicalCtx);
      const canonicalBytes = canonicalStringToBytes(canonicalJson);
      const signResult = await defaultSignatureProvider.sign(canonicalBytes);

      return {
        ...packet,
        payload: expiredPayload,
        canonicalJson,
        contextHashHex: signResult.contextHashHex,
        signatureHex: signResult.signatureHex,
        publicKeyHex: signResult.publicKeyHex,
      };
    },
  },
  {
    id: "replay-duplicate",
    title: "Replay Attack (Identical Packet)",
    description: "Exact duplicate of previously executed transaction TX-104 re-transmitted.",
    expectedInvariant: "Signature PASS, Context PASS, Freshness FAIL: Nonce was already consumed.",
    applyMutation: (packet) => packet,
  },
];

