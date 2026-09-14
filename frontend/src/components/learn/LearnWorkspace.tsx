import React, { useState, useEffect } from "react";
import { ShieldCheck, Layers, Clock, Lock, Cpu, Activity } from "lucide-react";

export const LearnWorkspace: React.FC = () => {
  // Simulated optical waveform points
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const generateWaveform = () => {
    const points: string[] = [];
    const width = 600;
    const height = 120;
    const midY = height / 2;

    for (let x = 0; x <= width; x += 10) {
      const t = (x + waveOffset * 4) / 40;
      const y = midY + Math.sin(t) * 25 + Math.cos(t * 1.8) * 12;
      points.push(`${x},${y.toFixed(1)}`);
    }
    return points.join(" ");
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-4">
      {/* Title & Concept Header */}
      <div className="border-b pb-5 border-slate-200 dark:border-slate-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Gateway Architecture & Research Foundation
        </span>
        <h1 className="text-2xl font-black text-heading mt-1">Why a Digital Signature Alone Is Not Enough</h1>
        <p className="text-sm text-caption mt-2 leading-relaxed">
          Traditional cryptographic systems verify whether a message was signed with the private key. But in digital transactions,
          a captured valid signature can be re-injected multiple times unless protocol-state invariants are strictly enforced.
        </p>
      </div>

      {/* Section 1: Comparison - Traditional vs Q-SignGuard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Traditional */}
        <div className="p-5 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold uppercase text-caption block">
            Traditional Signature Verification
          </span>
          <h3 className="text-base font-bold text-heading mt-1">"Did Alice authorize this?"</h3>
          <p className="text-xs text-caption mt-2 leading-relaxed">
            Evaluates the mathematical signature against the message payload. If the signature is intact, the transaction is assumed valid.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 font-medium">
            ⚠️ <strong>Vulnerability:</strong> Replay attacks succeed because the signature itself remains cryptographically genuine.
          </div>
        </div>

        {/* Q-SignGuard */}
        <div className="p-5 rounded-2xl border bg-indigo-500/5 border-indigo-500/30">
          <span className="text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 block">
            Q-SignGuard Protocol-Aware Gateway
          </span>
          <h3 className="text-base font-bold text-heading mt-1">
            "Is Alice's authorization valid to execute now?"
          </h3>
          <p className="text-xs text-caption mt-2 leading-relaxed">
            Separates cryptographic authenticity from execution validity. Enforces canonical context binding, single-use nonces, and monotonic sequences.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            🛡️ <strong>Defense:</strong> One authorized execution context yields exactly one authorized execution. Replays are blocked.
          </div>
        </div>
      </div>

      {/* Section 2: The 4 Invariants */}
      <div>
        <h2 className="text-lg font-black text-heading mb-4">The Four Protocol Security Stages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              <h4 className="text-xs font-bold text-heading uppercase">1. Authenticity (ML-DSA-65)</h4>
            </div>
            <p className="text-xs text-caption leading-relaxed">
              Verifies the post-quantum digital signature against the canonical digest to ensure the request originated from the keyholder.
            </p>
          </div>

          <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              <h4 className="text-xs font-bold text-heading uppercase">2. Canonical Context (RFC 8785)</h4>
            </div>
            <p className="text-xs text-caption leading-relaxed">
              Standardizes JSON serialization lexicographically to eliminate encoding ambiguities across different software stacks.
            </p>
          </div>

          <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <h4 className="text-xs font-bold text-heading uppercase">3. Protocol Freshness</h4>
            </div>
            <p className="text-xs text-caption leading-relaxed">
              Enforces single-use nonces, strictly monotonic sequence counters per session, and execution window TTL validity.
            </p>
          </div>

          <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-indigo-500" />
              <h4 className="text-xs font-bold text-heading uppercase">4. Execution Gate</h4>
            </div>
            <p className="text-xs text-caption leading-relaxed">
              Commits nonces atomically to the replay store only if all guards pass, releasing authorization to the payment ledger.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Research Foundation - Quantum Channel Simulation */}
      <div className="rounded-3xl border p-6 sm:p-7 card-panel border-slate-300 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-5 w-5 text-cyan-500" />
            <div>
              <h3 className="text-sm font-black text-heading">
                Quantum Channel Simulation (CV-QDS Concept)
              </h3>
              <span className="text-[11px] font-mono text-caption">
                Physical Communication Layer Research Simulation
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            Research Model
          </span>
        </div>

        {/* Scientific Teaching Insight */}
        <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 mb-5 text-xs text-caption leading-relaxed">
          <strong className="text-heading">Key Research Finding:</strong> Physical channel health and protocol-state execution validity are separate security layers.
          A captured, replayed transaction travels across a physically normal, healthy channel (normal QBER & fidelity).
          Therefore, <em>quantum physical link health alone cannot replace protocol-state gateway enforcement</em>.
        </div>

        {/* Simulated Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="p-3.5 rounded-xl border bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono uppercase text-caption block">Quantum Bit Error Rate (QBER)</span>
            <div className="text-lg font-black text-emerald-500 mt-1">2.1%</div>
            <span className="text-[10px] font-mono text-caption">Threshold: &lt; 8.0%</span>
          </div>
          <div className="p-3.5 rounded-xl border bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono uppercase text-caption block">Quantum State Fidelity</span>
            <div className="text-lg font-black text-emerald-500 mt-1">94.8%</div>
            <span className="text-[10px] font-mono text-caption">Purity Target: &gt; 90.0%</span>
          </div>
          <div className="p-3.5 rounded-xl border bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono uppercase text-caption block">Measurement Mismatch</span>
            <div className="text-lg font-black text-emerald-500 mt-1">4.3%</div>
            <span className="text-[10px] font-mono text-caption">Verification Cap: &lt; 11.0%</span>
          </div>
        </div>

        {/* Simulated Oscilloscope Waveform */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>Simulated Optical Waveform (Phase Quadrature)</span>
            </span>
            <span className="text-emerald-400 font-bold">LINK STABLE</span>
          </div>
          <div className="w-full h-24 overflow-hidden pt-2">
            <svg viewBox="0 0 600 120" className="w-full h-full">
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={generateWaveform()}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
