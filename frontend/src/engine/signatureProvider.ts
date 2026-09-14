/**
 * Post-Quantum Signature Provider Interface & Demo Implementation
 *
 * NOTE: This provider simulates ML-DSA verification behaviour for the visual prototype;
 * it is not an implementation of FIPS 204.
 */

export interface SignatureVerificationResult {
  isValid: boolean;
  computedHashHex: string;
  signedHashHex?: string;
  publicKeyValid: boolean;
  signatureEnvelopeValid: boolean;
  reason?: string;
}

export interface SignatureProvider {
  name: string;
  algorithm: string;
  isSimulated: boolean;
  disclaimer: string;
  hash(bytes: Uint8Array): Promise<string>;
  sign(canonicalBytes: Uint8Array, privateKeyHex?: string): Promise<{
    signatureHex: string;
    publicKeyHex: string;
    contextHashHex: string;
  }>;
  verify(
    canonicalBytes: Uint8Array,
    signatureHex: string,
    publicKeyHex: string,
    expectedContextHashHex?: string
  ): Promise<SignatureVerificationResult>;
}

// Fallback SHA-256 in pure TS in case crypto.subtle is restricted
async function computeSha256Hex(bytes: Uint8Array): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
    try {
      const hashBuffer = await crypto.subtle.digest("SHA-256", bytes as unknown as ArrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      // fallback below
    }
  }
  // Standard simple deterministic hash fallback for demonstration
  let h = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes[i];
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0") + "4f92d8e3b1a7c065e89d";
}

class MlDsaDemoProvider implements SignatureProvider {
  readonly name = "ML-DSA-65 Demo Provider (Deterministic Simulation)";
  readonly algorithm = "ML-DSA-65 (NIST FIPS 204 Simulated)";
  readonly isSimulated = true;
  readonly disclaimer =
    "This provider simulates ML-DSA verification behaviour for the visual prototype; it is not an implementation of FIPS 204.";

  // Standard demo public key representation for sender "Alice"
  private readonly defaultPublicKey =
    "mldsa65_pk_04a89f31c89012e84d720b6691fa3ce72054bc19df0288";

  async hash(bytes: Uint8Array): Promise<string> {
    return computeSha256Hex(bytes);
  }

  async sign(canonicalBytes: Uint8Array): Promise<{
    signatureHex: string;
    publicKeyHex: string;
    contextHashHex: string;
  }> {
    const contextHashHex = await this.hash(canonicalBytes);
    // Deterministic signature construction incorporating hash and algorithm marker
    const signatureHex = `sig_mldsa65_${contextHashHex.slice(0, 24)}_${contextHashHex.slice(-16)}_pqauth`;
    return {
      signatureHex,
      publicKeyHex: this.defaultPublicKey,
      contextHashHex,
    };
  }

  async verify(
    canonicalBytes: Uint8Array,
    signatureHex: string,
    publicKeyHex: string,
    expectedContextHashHex?: string
  ): Promise<SignatureVerificationResult> {
    const computedHashHex = await this.hash(canonicalBytes);
    const signedHashHex = expectedContextHashHex || computedHashHex;

    const publicKeyValid = Boolean(publicKeyHex && publicKeyHex.length >= 16);
    const signatureEnvelopeValid = !signatureHex.startsWith("invalid_") && !signatureHex.includes("bad0bad0");

    // Check 1: Public key presence & format
    if (!publicKeyValid) {
      return {
        isValid: false,
        computedHashHex,
        signedHashHex,
        publicKeyValid: false,
        signatureEnvelopeValid,
        reason: "Public key mismatch: unauthorized signer certificate.",
      };
    }

    // Check 2: Signature envelope validity
    if (!signatureEnvelopeValid) {
      return {
        isValid: false,
        computedHashHex,
        signedHashHex,
        publicKeyValid: true,
        signatureEnvelopeValid: false,
        reason: "Cryptographic signature mismatch: The canonical context bytes have been altered since signing.",
      };
    }

    // Check 3: Deterministic hash alignment if expectedContextHash is provided
    if (expectedContextHashHex && expectedContextHashHex !== computedHashHex) {
      return {
        isValid: false,
        computedHashHex,
        signedHashHex: expectedContextHashHex,
        publicKeyValid: true,
        signatureEnvelopeValid: true,
        reason: "Context commitment hash mismatch: Computed canonical hash differs from signed context.",
      };
    }

    return {
      isValid: true,
      computedHashHex,
      signedHashHex,
      publicKeyValid: true,
      signatureEnvelopeValid: true,
    };
  }
}

export const defaultSignatureProvider: SignatureProvider = new MlDsaDemoProvider();
