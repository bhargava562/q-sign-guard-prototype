import React from "react";
import { CheckCircle2, ArrowRight, FileText, RotateCcw } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const ProcessedReceipt: React.FC = () => {
  const {
    baselineAuthorizedPacket,
    lastDecision,
    triggerDuplicateArrival,
    openEvidenceSheet,
    resetToIncoming,
  } = useSecurityStore();

  if (!baselineAuthorizedPacket) return null;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 py-2">
      {/* Primary Gateway Response Receipt */}
      <div className="rounded-3xl border p-6 sm:p-8 shadow-sm transition-all card-panel overflow-hidden border-emerald-500/40 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent">
        {/* Top Status Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-5 mb-6 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                Gateway Decision: Allow
              </span>
              <h2 className="text-xl font-black text-heading">Transaction Processed & Authorized</h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-heading block">
              {baselineAuthorizedPacket.id}
            </span>
            <span className="text-[11px] font-mono text-caption">
              Simulation Latency: {lastDecision?.simulationLatencyMs ?? 4.1} ms
            </span>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase text-caption block">Participants</span>
            <span className="text-sm font-bold text-heading">
              {baselineAuthorizedPacket.payload.sender} ──&gt; {baselineAuthorizedPacket.payload.receiver}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-caption block">Authorized Action</span>
            <span className="text-sm font-bold text-heading">
              {baselineAuthorizedPacket.payload.message}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-caption block">Execution Enclave</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              State Committed ✓
            </span>
          </div>
        </div>

        {/* 4 Security Checks Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl border bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-mono uppercase text-caption block">1. Authenticity</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> VALID
            </span>
          </div>
          <div className="p-3 rounded-xl border bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-mono uppercase text-caption block">2. Context</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> BOUND
            </span>
          </div>
          <div className="p-3 rounded-xl border bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-mono uppercase text-caption block">3. Freshness</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> FRESH
            </span>
          </div>
          <div className="p-3 rounded-xl border bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-mono uppercase text-caption block">4. Execution</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> ALLOWED
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => openEvidenceSheet()}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-heading hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <FileText className="h-4 w-4 text-indigo-500" />
            <span>View Verification Details</span>
          </button>
          <button
            type="button"
            onClick={resetToIncoming}
            className="text-xs font-medium text-caption hover:text-heading transition-colors"
          >
            Process Next Transaction Queue →
          </button>
        </div>
      </div>

      {/* Security Operational Hook: Duplicate Request Arrival */}
      <div className="rounded-3xl border p-6 sm:p-7 shadow-sm card-panel border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-purple-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                Security Operator Invariant Test
              </span>
              <h3 className="text-base font-black text-heading">
                This authorization has now been consumed.
              </h3>
              <p className="text-xs text-caption mt-1 max-w-xl leading-relaxed">
                What happens if an attacker captures this network packet and transmits the exact same signed request again?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={triggerDuplicateArrival}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-[0.98] shrink-0"
          >
            <span>Process Duplicate Request</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
