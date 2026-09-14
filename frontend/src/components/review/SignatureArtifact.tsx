import React, { useMemo } from "react";
import { ShieldCheck, Cpu, Fingerprint, Lock } from "lucide-react";
import type { SignatureMetadata } from "../../types/transaction";

interface SignatureArtifactProps {
  signature: SignatureMetadata;
  signerName: string;
}

export const SignatureArtifact: React.FC<SignatureArtifactProps> = ({ signature, signerName }) => {
  // Generate deterministic visual lattice/matrix nodes from signature hex
  const matrixCells = useMemo(() => {
    const hex = signature.signatureHex || "3045022100e4b8a192c7d3f84102938475610293847561029384756102938475";
    const cells = [];
    const rows = 6;
    const cols = 28;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const charIndex = (r * cols + c) % hex.length;
        const charCode = parseInt(hex[charIndex] || "0", 16);
        const isActive = charCode % 3 !== 0;
        const opacity = ((charCode * 17) % 80 + 20) / 100;
        cells.push({ r, c, isActive, opacity, charCode });
      }
    }
    return cells;
  }, [signature.signatureHex]);

  // Generate waveform polygon points
  const waveformPoints = useMemo(() => {
    const hex = signature.signatureHex || "";
    const points = [];
    const width = 360;
    const height = 36;
    const step = 6;

    for (let x = 0; x <= width; x += step) {
      const idx = Math.floor((x / width) * hex.length) % hex.length;
      const val = parseInt(hex[idx] || "0", 16);
      const y = height / 2 + (val - 7.5) * 1.8;
      points.push(`${x},${y.toFixed(1)}`);
    }
    return points.join(" ");
  }, [signature.signatureHex]);

  return (
    <div
      className="w-full rounded-2xl border p-4 sm:p-5 flex flex-col gap-3.5 relative overflow-hidden transition-all shadow-sm"
      style={{
        backgroundColor: "rgb(var(--surface-muted))",
        borderColor: "rgb(var(--border))",
      }}
    >
      {/* Top Banner: Algorithm & Seal Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-500 flex items-center justify-center">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-heading tracking-wide uppercase">
                SIGNATURE VISUALIZATION
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-bold">
                ML-DSA-65
              </span>
            </div>
            <span className="text-[10px] font-mono text-caption block">
              ML-DSA-65 Cryptographic Signature • Demonstration Representation ({signerName})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold">
          <Lock className="w-3 h-3 text-emerald-500" />
          <span>CRYPTOGRAPHICALLY SEALED</span>
        </div>
      </div>

      {/* SVG Cryptographic Lattice & Waveform Visualization */}
      <div className="relative rounded-xl border border-sky-500/20 bg-slate-950 p-3 sm:p-4 overflow-hidden flex flex-col gap-2.5">
        {/* Subtle grid background scan line */}
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:12px_12px] opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-60 animate-pulse" />

        <div className="flex items-center justify-between text-[10px] font-mono text-sky-400/80">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-sky-400" />
            <span>MODULE-LATTICE ENTROPY MAP</span>
          </span>
          <span>1312 BYTES (ML-DSA-65)</span>
        </div>

        {/* The Lattice Matrix SVG */}
        <svg
          viewBox="0 0 280 60"
          className="w-full h-12 text-sky-400"
          preserveAspectRatio="none"
        >
          {matrixCells.map((cell, idx) => (
            <rect
              key={idx}
              x={cell.c * 10 + 1}
              y={cell.r * 10 + 1}
              width={7}
              height={7}
              rx={1.5}
              fill="currentColor"
              opacity={cell.isActive ? cell.opacity : 0.08}
            />
          ))}
        </svg>

        {/* Cryptographic Waveform Signature Trace */}
        <div className="w-full pt-1 border-t border-sky-900/40">
          <svg viewBox="0 0 360 36" className="w-full h-7 overflow-visible">
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={waveformPoints}
              opacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* Cryptographic Verification Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
        <div
          className="p-2.5 rounded-xl border flex flex-col gap-0.5"
          style={{ backgroundColor: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
        >
          <span className="text-[10px] text-caption uppercase font-sans font-semibold">Public Key Fingerprint</span>
          <span className="font-bold text-heading truncate">{signature.publicKeyFingerprint}</span>
        </div>

        <div
          className="p-2.5 rounded-xl border flex flex-col gap-0.5"
          style={{ backgroundColor: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
        >
          <span className="text-[10px] text-caption uppercase font-sans font-semibold">Attached Signature Digest</span>
          <span className="font-bold text-sky-600 dark:text-sky-400 truncate">
            {signature.signatureHex.slice(0, 24)}...
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-caption pt-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Pre-verified by Signer Enclave</span>
        </span>
        <span>Awaiting Gateway Protocol Authorization</span>
      </div>
    </div>
  );
};
