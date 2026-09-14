import React from "react";
import {
  CheckCircle2,
  XCircle,
  Inbox,
  FileSearch,
  Lock,
} from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";
import { AnalystPanel } from "../analyst/AnalystPanel";

export const ExecutionReceipt: React.FC = () => {
  const {
    selectedTransaction,
    lastDecision,
    returnToInbox,
    openEvidenceSheet,
  } = useSecurityStore();

  if (!selectedTransaction || !lastDecision) return null;

  const isAccepted = lastDecision.status === "accepted";
  const { requestId, transaction, securityContext } = selectedTransaction;
  const isReplay = lastDecision.ruleViolated === "REPLAY_NONCE_REUSED";

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4">
      <div
        className="rounded-3xl border p-6 sm:p-10 shadow-xl flex flex-col items-center text-center gap-7 transition-all relative overflow-hidden"
        style={{
          backgroundColor: "rgb(var(--surface))",
          borderColor: "rgb(var(--border))",
        }}
      >
        {/* Decorative background glow */}
        <div
          className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isAccepted ? "bg-emerald-500/15" : "bg-rose-500/15"
          }`}
        />

        {/* ── CASE 1: AUTHORIZED RECEIPT ── */}
        {isAccepted && (
          <>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                  ✓ TRANSACTION AUTHORIZED
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-heading">
                  {transaction.formattedAmount} ({transaction.sender} → {transaction.receiver})
                </h2>
                <span className="text-xs font-mono text-caption block">
                  Request ID: {requestId} · Dispatched to Settlement
                </span>
              </div>
            </div>

            {/* 4 Checks Summary */}
            <div
              className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-2xl border font-mono text-xs text-left"
              style={{
                backgroundColor: "rgb(var(--surface-muted))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <div>
                <span className="text-[10px] text-caption uppercase block font-sans">AUTHENTICITY</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VALID
                </span>
              </div>
              <div>
                <span className="text-[10px] text-caption uppercase block font-sans">CONTEXT</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VALID
                </span>
              </div>
              <div>
                <span className="text-[10px] text-caption uppercase block font-sans">FRESHNESS</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VALID
                </span>
              </div>
              <div>
                <span className="text-[10px] text-caption uppercase block font-sans">EXECUTION</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AUTHORIZED
                </span>
              </div>
            </div>

            {/* State Commit Callout */}
            <div
              className="w-full max-w-xl p-4 rounded-2xl border text-left flex items-start gap-3"
              style={{
                backgroundColor: "rgb(var(--surface-muted))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs">
                <span className="font-bold text-heading">Authorization Committed. Nonce Consumed.</span>
                <p className="text-caption leading-relaxed">
                  Nonce <span className="font-mono font-bold text-heading">{securityContext.nonce}</span> has been committed to the stateful replay store for session{" "}
                  <span className="font-mono font-bold text-heading">{securityContext.sessionId}</span>. Duplicate requests carrying this signed authorization will be deflected.
                </p>
              </div>
            </div>

            {/* AI Security Analyst Panel */}
            <AnalystPanel />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={returnToInbox}
                className="flex-1 w-full py-3.5 px-5 rounded-2xl font-black text-sm text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 cursor-pointer"
              >
                <Inbox className="w-4 h-4" />
                <span>RETURN TO INBOX</span>
              </button>

              <button
                type="button"
                onClick={() => openEvidenceSheet()}
                className="py-3.5 px-5 rounded-2xl font-bold text-sm border hover:bg-slate-500/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--text-secondary))" }}
              >
                <FileSearch className="w-4 h-4" />
                <span>VIEW EVIDENCE</span>
              </button>
            </div>
          </>
        )}

        {/* ── CASE 2: EXECUTION BLOCKED (KILLER MOMENT) ── */}
        {!isAccepted && (
          <>
            {/* Gate checks summary row */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono font-bold flex-wrap justify-center">
              <span className={`flex items-center gap-1 ${lastDecision.authenticity === "valid" ? "text-emerald-500" : "text-rose-500"}`}>
                {lastDecision.authenticity === "valid" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                AUTHENTICITY
              </span>
              <span className="text-caption">→</span>
              <span
                className={`flex items-center gap-1 ${
                  lastDecision.ruleViolated === "SESSION_INVALID" ? "text-rose-500" : "text-emerald-500"
                }`}
              >
                {lastDecision.ruleViolated === "SESSION_INVALID" ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                CONTEXT
              </span>
              <span className="text-caption">→</span>
              <span
                className={`flex items-center gap-1 ${
                  lastDecision.ruleViolated === "REPLAY_NONCE_REUSED" || lastDecision.ruleViolated === "CONTEXT_EXPIRED" || lastDecision.ruleViolated === "SEQUENCE_OUT_OF_ORDER"
                    ? "text-rose-500"
                    : lastDecision.authenticity === "invalid"
                    ? "text-caption opacity-40"
                    : "text-emerald-500"
                }`}
              >
                {lastDecision.ruleViolated === "REPLAY_NONCE_REUSED" || lastDecision.ruleViolated === "CONTEXT_EXPIRED" || lastDecision.ruleViolated === "SEQUENCE_OUT_OF_ORDER" ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                FRESHNESS
              </span>
              <span className="text-caption">→</span>
              <span className="flex items-center gap-1 text-rose-500">
                <XCircle className="w-4 h-4" />
                EXECUTION GATE
              </span>
            </div>

            {/* The Hero Statement */}
            <div className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 flex flex-col items-center gap-3 shadow-xl">
              <span className="text-xs font-mono font-black uppercase tracking-widest text-rose-500">
                GATEWAY EXECUTION DEFENSE · INVARIANT ENFORCED
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 tracking-tight leading-tight">
                {isReplay ? (
                  <>
                    THE SIGNATURE IS VALID.
                    <br />
                    THE EXECUTION IS NOT.
                  </>
                ) : (
                  "EXECUTION BLOCKED"
                )}
              </h2>
              <p className="text-xs sm:text-sm max-w-lg text-rose-800/90 dark:text-rose-200/90 leading-relaxed font-medium">
                {lastDecision.reason}
              </p>
            </div>

            {/* Protocol state detail card */}
            <div
              className="w-full max-w-xl p-4 sm:p-5 rounded-2xl border text-left font-mono text-xs flex flex-col gap-2"
              style={{
                backgroundColor: "rgb(var(--surface-muted))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                <span className="text-caption font-sans font-semibold">Violation Rule Code:</span>
                <span className="font-bold text-rose-500">{lastDecision.ruleViolated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-caption font-sans">Cryptographic Signature:</span>
                <span className={`font-bold ${lastDecision.authenticity === "valid" ? "text-emerald-500" : "text-rose-500"}`}>
                  {lastDecision.authenticity === "valid" ? "VALID (ML-DSA-65 Attached)" : "INTEGRITY MISMATCH"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-caption font-sans">Session / Ingress Nonce:</span>
                <span className="font-bold text-heading">
                  {securityContext.sessionId} / {securityContext.nonce}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-caption font-sans">Execution Verdict:</span>
                <span className="font-bold text-rose-500 uppercase">BLOCKED (0 funds dispatched)</span>
              </div>
            </div>

            {/* AI Security Analyst Panel */}
            <AnalystPanel />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={returnToInbox}
                className="flex-1 w-full py-3.5 px-5 rounded-2xl font-black text-sm text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 cursor-pointer"
              >
                <Inbox className="w-4 h-4" />
                <span>RETURN TO INBOX</span>
              </button>

              <button
                type="button"
                onClick={() => openEvidenceSheet()}
                className="py-3.5 px-5 rounded-2xl font-bold text-sm border hover:bg-slate-500/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--text-secondary))" }}
              >
                <FileSearch className="w-4 h-4" />
                <span>VIEW SECURITY EVIDENCE</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
