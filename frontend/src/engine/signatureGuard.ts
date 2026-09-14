import type { SignedTransactionPacket, EvidenceItem } from "../types/transaction";
import { buildCanonicalContext, canonicalizeJson, canonicalStringToBytes } from "./canonicalize";
import type { SignatureProvider } from "./signatureProvider";

export interface SignatureGuardResult {
  passed: boolean;
  computedHashHex: string;
  reason?: string;
  evidence: EvidenceItem[];
}

export async function evaluateSignatureGuard(
  packet: SignedTransactionPacket,
  provider: SignatureProvider
): Promise<SignatureGuardResult> {
  const effectivePayload = {
    ...packet.payload,
    message: packet.tamperedMessage !== undefined ? packet.tamperedMessage : packet.payload.message,
    sessionId: packet.tamperedSessionId !== undefined ? packet.tamperedSessionId : packet.payload.sessionId,
  };

  const canonicalContext = buildCanonicalContext(effectivePayload);
  const canonicalStr = canonicalizeJson(canonicalContext);
  const canonicalBytes = canonicalStringToBytes(canonicalStr);

  const verification = await provider.verify(
    canonicalBytes,
    packet.signatureHex,
    packet.publicKeyHex
  );

  const evidence: EvidenceItem[] = [
    {
      id: "sig_algorithm",
      label: "Signature Algorithm",
      status: "pass",
      observed: packet.algorithm,
      expected: provider.algorithm,
      description: "Post-quantum digital signature algorithm standard.",
    },
    {
      id: "sig_cryptographic_verification",
      label: "ML-DSA Verification",
      status: verification.isValid ? "pass" : "fail",
      observed: verification.isValid ? "VALID_PQ_SIGNATURE" : "SIGNATURE_MISMATCH",
      expected: "VALID_PQ_SIGNATURE",
      description: verification.isValid
        ? "Canonical payload hash matches signature with sender public key."
        : verification.reason || "Payload or signed context altered in transit.",
    },
    {
      id: "sig_context_hash",
      label: "Canonical Context SHA-256",
      status: verification.isValid ? "pass" : "fail",
      observed: verification.computedHashHex.slice(0, 16) + "...",
      expected: packet.contextHashHex.slice(0, 16) + "...",
      description: "Cryptographic hash of the deterministic canonical context.",
    },
  ];

  return {
    passed: verification.isValid,
    computedHashHex: verification.computedHashHex,
    reason: verification.reason,
    evidence,
  };
}
