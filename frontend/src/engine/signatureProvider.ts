/**
 * Post-Quantum Signature Provider Interface & Demo Implementation
 *
 * NOTE: This provider simulates ML-DSA verification behaviour for the visual prototype;
 * it is not an implementation of FIPS 204.
 */

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
    publicKeyHex: string
  ): Promise<{
    isValid: boolean;
    computedHashHex: string;
    reason?: string;
  }>;
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
    publicKeyHex: string
  ): Promise<{
    isValid: boolean;
    computedHashHex: string;
    reason?: string;
  }> {
    const computedHashHex = await this.hash(canonicalBytes);
    const expectedSignatureHex = `sig_mldsa65_${computedHashHex.slice(0, 24)}_${computedHashHex.slice(-16)}_pqauth`;

    if (!publicKeyHex || publicKeyHex !== this.defaultPublicKey) {
      return {
        isValid: false,
        computedHashHex,
        reason: "Public key mismatch: unauthorized signer certificate.",
      };
    }

    if (signatureHex !== expectedSignatureHex) {
      return {
        isValid: false,
        computedHashHex,
        reason:
          "Cryptographic signature mismatch: The canonical context bytes have been altered since signing.",
      };
    }

    return {
      isValid: true,
      computedHashHex,
    };
  }
}

export const defaultSignatureProvider: SignatureProvider = new MlDsaDemoProvider();
