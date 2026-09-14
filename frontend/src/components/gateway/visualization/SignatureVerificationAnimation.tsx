import React from "react";
import { motion } from "motion/react";
import { Cpu, CheckCircle2, XCircle, KeyRound, ShieldAlert, Fingerprint } from "lucide-react";
import type { SignedTransactionPacket } from "../../../types/transaction";
import type { GatewayTraceEvent } from "../../../types/gatewayTrace";

interface SignatureVerificationAnimationProps {
  packet: SignedTransactionPacket;
  event: GatewayTraceEvent | null;
}

export const SignatureVerificationAnimation: React.FC<SignatureVerificationAnimationProps> = ({
  packet,
  event,
}) => {
  const isSuccess = event?.status !== "failure";
  const signedHash = event?.metadata?.signedHashHex || packet.contextHashHex;
  const computedHash = event?.metadata?.computedHashHex || packet.contextHashHex;
  const isHashMismatch = signedHash !== computedHash || !isSuccess;

  // Generate deterministic binary lattice cells from the signature hex
  const hex = packet.signatureHex.replace(/[^0-9a-f]/gi, "");
  const cells: boolean[] = [];
  for (let i = 0; i < 48; i++) {
    const charCode = hex.charCodeAt(i % hex.length) || 0;
    cells.push((charCode + i) % 2 === 0);
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-3">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 mb-4 px-3 py-1 rounded-full border text-xs font-mono font-semibold ${
          isSuccess
            ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}
      >
        <Cpu className="w-3.5 h-3.5 animate-pulse" />
        <span>STAGE 5/8: NIST FIPS 204 ML-DSA-65 CRYPTOGRAPHIC VERIFICATION</span>
      </motion.div>

      <div className="w-full max-w-3xl flex flex-col gap-4 font-mono text-xs">
        {/* Main Verification Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Cryptographic Signature Artifact Matrix */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl border flex flex-col justify-between shadow-xl ${
              isSuccess
                ? "bg-slate-900/90 border-purple-500/30"
                : "bg-red-950/40 border-red-500/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Fingerprint className={`w-3.5 h-3.5 ${isSuccess ? "text-purple-400" : "text-red-400"}`} />
                  SIGNATURE BYTE STRUCTURE
                </span>
                <span className="text-[10px] text-slate-400">ML-DSA-65</span>
              </div>

              {/* Lattice structure matrix */}
              <div className="my-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="grid grid-cols-12 gap-1 mb-2">
                  {cells.map((filled, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.01 }}
                      className={`h-3 rounded-sm ${
                        isSuccess
                          ? filled
                            ? "bg-purple-500/80 shadow-sm shadow-purple-500/30"
                            : "bg-slate-800/40"
                          : filled
                          ? "bg-red-500/80 shadow-sm shadow-red-500/30"
                          : "bg-slate-900/60"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                  <span>Lattice Dimension: k=6, l=5</span>
                  <span className={isSuccess ? "text-purple-400 font-bold" : "text-red-400 font-bold"}>
                    {isSuccess ? "AUTHENTIC ENVELOPE" : "TAMPERED ENVELOPE"}
                  </span>
                </div>
              </div>

              {/* Public Key and Signer */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-purple-400" />
                  SIGNER PUBLIC KEY:
                </span>
                <span className="text-slate-200 font-bold">
                  {packet.publicKeyFingerprint || "7A:91:4F:2D:8C:77:E1:90"}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-2">
              Visual representation of binary cryptographic data for operator verification.
            </p>
          </motion.div>

          {/* Right: Cryptographic Digest & Mathematical Verification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-2xl border bg-slate-950/80 border-slate-800 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                <span className="font-bold text-slate-200">DIGEST COMPARISON</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isSuccess
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {isSuccess ? "MATHEMATICAL MATCH" : "MISMATCH DETECTED"}
                </span>
              </div>

              <div className="space-y-2.5 my-3 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">
                    SIGNED CONTEXT HASH (from signature envelope):
                  </span>
                  <div className="p-2 rounded-lg bg-slate-900 text-sky-400 font-mono text-[10px] break-all border border-slate-800">
                    {signedHash}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">
                    COMPUTED INBOUND HASH (from RFC 8785 canonical bytes):
                  </span>
                  <div
                    className={`p-2 rounded-lg font-mono text-[10px] break-all border ${
                      isHashMismatch
                        ? "bg-red-950/60 text-red-300 border-red-500/30"
                        : "bg-slate-900 text-emerald-400 border-slate-800"
                    }`}
                  >
                    {computedHash}
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict Box */}
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                isSuccess
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-red-500/15 border-red-500/30 text-red-300"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <div className="text-[11px]">
                <strong className="block text-slate-100">
                  {isSuccess
                    ? "ML-DSA-65 DEMONSTRATION PROVIDER: SIGNATURE VALID"
                    : "CRYPTOGRAPHIC MISMATCH: PAYLOAD ALTERED IN TRANSIT"}
                </strong>
                <span className="text-[10px] text-slate-300">
                  {isSuccess
                    ? "Authentic post-quantum origin confirmed."
                    : "Signature was computed over a different context. Authenticity failed."}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Replay Notice if Applicable */}
        {packet.fixtureCondition === "replay" && isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-300 text-xs"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>CRITICAL OBSERVATION:</strong> The digital signature is authentic, but signature verification alone cannot guarantee freshness.
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-200">
              NEXT: REPLAY CHECK
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
