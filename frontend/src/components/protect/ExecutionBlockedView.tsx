import React, { useState } from "react";
import { XCircle, CheckCircle2, FileText, RefreshCw, Layers } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";
import { InvalidRequestPicker } from "./InvalidRequestPicker";

export const ExecutionBlockedView: React.FC = () => {
  const {
    lastDecision,
    openEvidenceSheet,
    resetToIncoming,
  } = useSecurityStore();

  const [pickerOpen, setPickerOpen] = useState(false);

  const isReplay = lastDecision?.ruleViolated === "REPLAY_NONCE_REUSED";

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 py-2">
      {/* Primary Block Card */}
      <div className="rounded-3xl border p-6 sm:p-8 shadow-sm transition-all card-panel border-rose-500/40 bg-gradient-to-b from-rose-500/10 via-transparent to-transparent">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-5 mb-6 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                Gateway Enforcement: Block
              </span>
              <h2 className="text-xl font-black text-heading">
                {isReplay ? "Execution Blocked — Duplicate Authorization" : "Execution Blocked — Invariant Violation"}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-rose-500 block">
              {lastDecision?.ruleViolated || "RULE_VIOLATION"}
            </span>
            <span className="text-[11px] font-mono text-caption">
              Simulation Latency: {lastDecision?.simulationLatencyMs ?? 4.2} ms
            </span>
          </div>
        </div>

        {/* Hero Visual Contrast Grid: Authenticity vs Execution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Box 1: Authenticity */}
          <div className="p-4 rounded-2xl border bg-emerald-500/5 border-emerald-500/30">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
              Cryptographic Authenticity
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                AUTHENTICITY: VALID ✓
              </span>
            </div>
            <p className="text-xs text-caption mt-2 leading-relaxed">
              {isReplay
                ? "The post-quantum ML-DSA-65 signature is authentic and authorized by Alice."
                : lastDecision?.authenticity === "valid"
                ? "Digital signature matches the canonical context hash."
                : "Signature verification failed: Content altered in transit."}
            </p>
          </div>

          {/* Box 2: Execution Validity */}
          <div className="p-4 rounded-2xl border bg-rose-500/5 border-rose-500/30">
            <span className="text-[10px] font-mono uppercase font-bold text-rose-600 dark:text-rose-400 block">
              Execution Validity Gate
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
              <span className="text-base font-black text-rose-600 dark:text-rose-400">
                EXECUTION: BLOCKED ✕
              </span>
            </div>
            <p className="text-xs text-caption mt-2 leading-relaxed">
              {isReplay
                ? "Nonce N-88321 was already consumed. This authorization cannot be executed again."
                : lastDecision?.reason}
            </p>
          </div>
        </div>

        {/* Hero Sentence Callout */}
        <div className="rounded-2xl p-4 text-center border font-mono border-rose-500/30 bg-rose-500/10 mb-6">
          <div className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tracking-tight">
            "THE SIGNATURE IS VALID. THE EXECUTION IS NOT."
          </div>
          <p className="text-xs text-caption mt-1">
            A valid digital signature proves authorized origin, but does not make an old authorization executable again.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => openEvidenceSheet()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-heading hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4 text-indigo-500" />
            <span>View Verification Evidence</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Layers className="h-4 w-4" />
              <span>Test Another Request</span>
            </button>
            <button
              type="button"
              onClick={resetToIncoming}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Process Next Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Test Modal */}
      {pickerOpen && <InvalidRequestPicker onClose={() => setPickerOpen(false)} />}
    </div>
  );
};
