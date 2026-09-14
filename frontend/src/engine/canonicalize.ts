import type { CanonicalContext, TransactionPayload } from "../types/transaction";

/**
 * RFC 8785: JSON Canonicalization Scheme (JCS)
 * Strictly formats transaction context with lexicographically sorted keys,
 * no arbitrary whitespace, and consistent representation for deterministic hashing.
 */
export function buildCanonicalContext(payload: TransactionPayload): CanonicalContext {
  return {
    expires_at: payload.expiresAt,
    issued_at: payload.issuedAt,
    message: payload.message,
    nonce: payload.nonce,
    receiver: payload.receiver,
    sender: payload.sender,
    sequence: payload.sequence,
    session_id: payload.sessionId,
  };
}

export function canonicalizeJson(context: CanonicalContext): string {
  // RFC 8785 lexicographical key order
  const sortedKeys: (keyof CanonicalContext)[] = [
    "expires_at",
    "issued_at",
    "message",
    "nonce",
    "receiver",
    "sender",
    "sequence",
    "session_id",
  ];

  const obj: Record<string, string | number> = {};
  for (const key of sortedKeys) {
    obj[key] = context[key];
  }

  // Pure canonical string with no indent or trailing spaces
  return JSON.stringify(obj);
}

export function canonicalStringToBytes(canonicalStr: string): Uint8Array {
  return new TextEncoder().encode(canonicalStr);
}
