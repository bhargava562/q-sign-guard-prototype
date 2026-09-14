import React, { useState } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, ShieldAlert, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const DecisionBanner: React.FC = () => {
  const { lastDecision, lifecycleState } = useSecurityStore();
  const [showEvidence, setShowEvidence] = useState(false);

  if (!lastDecision || lifecycleState === "EMPTY") {
    return (
      <div
        className="rounded-2xl border p-5 text-center shadow-sm transition-all"
        style={{
          backgroundColor: "rgba(var(--surface), 0.9)",
          borderColor: "rgb(var(--border))",
        }}
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl mb-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
          <Zap className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
          Security Decision HUD
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Awaiting transaction dispatch or attack simulation to evaluate policy invariants.
        </p>
      </div>
    );
  }

  const isAccepted = lastDecision.status === "accepted";
  const isAuthValid = lastDecision.authenticity === "valid";
  const isExecBlocked = lastDecision.execution === "blocked";
  const isHeroReplay = isAuthValid && isExecBlocked;

  return (
    <div
      className={`relative rounded-2xl border p-5 shadow-sm transition-all duration-300 overflow-hidden ${
        isHeroReplay
          ? "border-rose-500/80 ring-2 ring-rose-500/20 bg-rose-50/20 dark:bg-rose-950/10"
          : isAccepted
          ? "border-emerald-500/80 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10"
          : "border-rose-500/80 ring-2 ring-rose-500/20 bg-rose-50/20 dark:bg-rose-950/10"
      }`}
      style={{
        backgroundColor: "rgba(var(--surface), 0.95)",
      }}
    >
      {/* Top Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white font-extrabold shadow-md ${
              isAccepted
                ? "bg-emerald-500 shadow-emerald-500/20"
                : isHeroReplay
                ? "bg-rose-500 shadow-rose-500/30"
                : "bg-rose-600 shadow-rose-600/30"
            }`}
          >
            {isAccepted ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <ShieldAlert className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold tracking-wider uppercase text-slate-400">
                GATEWAY VERDICT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                {lastDecision.simulationLatencyMs} ms
              </span>
            </div>
            <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
              {isAccepted
                ? "TRANSACTION AUTHORIZED & COMMITTED"
                : isHeroReplay
                ? "REPLAY ATTACK BLOCKED — EXECUTION PREVENTED"
                : "SECURITY POLICY ENFORCEMENT — BLOCKED"}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowEvidence(!showEvidence)}
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--foreground))" }}
        >
          <span>{showEvidence ? "Hide Evidence" : "Evidence Matrix"}</span>
          {showEvidence ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Visual HUD Comparison: Origin Authenticity vs Execution Validity */}
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Card 1: Authenticity Check */}
        <div
          className={`rounded-2xl border p-4 flex items-center justify-between transition-all ${
            isAuthValid
              ? "bg-emerald-500/10 border-emerald-500/40"
              : "bg-rose-500/10 border-rose-500/40"
          }`}
        >
          <div>
            <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-400">
              Check 1: Cryptographic Origin
            </span>
            <div className="text-sm font-black mt-1 flex items-center gap-2">
              {isAuthValid ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-400">AUTHENTICITY: VALID ✓</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-500" />
                  <span className="text-rose-700 dark:text-rose-400">AUTHENTICITY: TAMPERED ✕</span>
                </>
              )}
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              {isAuthValid ? "ML-DSA-65 post-quantum signature intact" : "Signature does not match payload hash"}
            </p>
          </div>
        </div>

        {/* Card 2: Execution Validity Check */}
        <div
          className={`rounded-2xl border p-4 flex items-center justify-between transition-all ${
            !isExecBlocked
              ? "bg-emerald-500/10 border-emerald-500/40"
              : "bg-rose-500/10 border-rose-500/40"
          }`}
        >
          <div>
            <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-400">
              Check 2: Execution Validity
            </span>
            <div className="text-sm font-black mt-1 flex items-center gap-2">
              {!isExecBlocked ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-400">EXECUTION: AUTHORIZED ✓</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-500" />
                  <span className="text-rose-700 dark:text-rose-400">EXECUTION: BLOCKED ✕</span>
                </>
              )}
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              {!isExecBlocked ? "Nonce fresh, sequence monotonic" : "Context consumed or sequence violation"}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Invariant Formula Chip */}
      <div
        className="rounded-xl p-3 text-center border font-mono text-xs flex flex-wrap items-center justify-center gap-2"
        style={{
          backgroundColor: isHeroReplay ? "rgba(244, 63, 94, 0.08)" : "rgb(var(--surface-muted))",
          borderColor: isHeroReplay ? "rgba(244, 63, 94, 0.3)" : "rgb(var(--border))",
        }}
      >
        <span className="font-bold text-emerald-600 dark:text-emerald-400">Signed Authenticity ✓</span>
        <span className="text-slate-400">+</span>
        <span className={`font-bold ${!isExecBlocked ? "text-emerald-600" : "text-rose-600"}`}>
          {!isExecBlocked ? "Fresh Context ✓" : "Reused Context ✕"}
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
        <span className={`font-black px-2 py-0.5 rounded ${isAccepted ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
          {isAccepted ? "ALLOW EXECUTION" : "BLOCK EXECUTION"}
        </span>
      </div>

      {/* Expandable Evidence Table */}
      {showEvidence && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-[10px] uppercase font-mono text-slate-400">
                  <th className="py-2 px-2">Checkpoint</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Observed</th>
                  <th className="py-2 px-2">Expected</th>
                </tr>
              </thead>
              <tbody className="divide-y text-[11px] font-mono">
                {lastDecision.evidence.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-2 font-semibold text-slate-800 dark:text-slate-200">{item.label}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          item.status === "pass"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
                      {item.observed}
                    </td>
                    <td className="py-2 px-2 text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
                      {item.expected}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
