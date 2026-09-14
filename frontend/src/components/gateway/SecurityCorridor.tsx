import React from "react";
import { CheckCircle2, XCircle, ShieldCheck, Cpu, Database, Send, Radio } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const SecurityCorridor: React.FC = () => {
  const { selectedTransaction, guardStates, pipelinePhase } = useSecurityStore();

  if (!selectedTransaction) return null;

  const { requestId, transaction, securityContext } = selectedTransaction;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-6">
      {/* Corridor Header */}
      <div className="flex flex-col items-center text-center gap-1.5">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 text-xs font-mono font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>GATEWAY TRANSIT CORRIDOR ACTIVE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
          Verifying Packet: <span className="text-sky-600 dark:text-sky-400">{requestId}</span>
        </h2>
        <p className="text-xs text-caption font-mono">
          Evaluating protocol-level invariants in secure hardware enclave
        </p>
      </div>

      {/* Cinematic Security Corridor Container */}
      <div
        className="rounded-3xl border p-6 sm:p-10 shadow-2xl flex flex-col gap-8 relative overflow-hidden transition-all backdrop-blur-md"
        style={{
          backgroundColor: "rgb(var(--surface))",
          borderColor: "rgb(var(--border))",
        }}
      >
        {/* Futuristic background scan grid & light beam */}
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-[1px] animate-pulse" />

        {/* Traveling Transaction Packet Indicator */}
        <div
          className="p-4 rounded-2xl border flex items-center justify-between gap-4 font-mono text-xs shadow-inner"
          style={{
            backgroundColor: "rgb(var(--surface-muted))",
            borderColor: "rgb(var(--border))",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
            <span className="font-bold text-heading">PAYLOAD:</span>
            <span className="text-body font-sans font-semibold">
              {transaction.sender} → {transaction.receiver} ({transaction.formattedAmount})
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-caption">
            <span>SESSION: {securityContext.sessionId}</span>
            <span>NONCE: {securityContext.nonce}</span>
          </div>
        </div>

        {/* The 4 Secure Processing Gates Corridor */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {/* Gate 1: Authenticity */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-2.5 transition-all duration-300 relative overflow-hidden ${
              guardStates.signaturePassed === true
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : guardStates.signaturePassed === false
                ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                : "border-sky-500/40 bg-sky-500/5 animate-pulse"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-black">
              <span>1. AUTHENTICITY</span>
              {guardStates.signaturePassed === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {guardStates.signaturePassed === false && <XCircle className="w-4 h-4 text-rose-500" />}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5 text-sky-500" />
              <span>ML-DSA-65</span>
            </div>
            <p className="text-[10px] text-caption font-mono leading-tight">
              {guardStates.signaturePassed === true
                ? "Valid Post-Quantum Signature"
                : guardStates.signaturePassed === false
                ? "Signature Integrity Failed"
                : "Verifying canonical context..."}
            </p>
          </div>

          {/* Gate 2: Context */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-2.5 transition-all duration-300 relative overflow-hidden ${
              guardStates.contextPassed === true
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : guardStates.contextPassed === false
                ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                : guardStates.signaturePassed !== null
                ? "border-sky-500/40 bg-sky-500/5 animate-pulse"
                : "opacity-40 border-slate-300 dark:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-black">
              <span>2. CONTEXT</span>
              {guardStates.contextPassed === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {guardStates.contextPassed === false && <XCircle className="w-4 h-4 text-rose-500" />}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>Identity & Session</span>
            </div>
            <p className="text-[10px] text-caption font-mono leading-tight">
              {guardStates.contextPassed === true
                ? "Session Active & Authorized"
                : guardStates.contextPassed === false
                ? "Context Policy Violation"
                : "Checking access policy..."}
            </p>
          </div>

          {/* Gate 3: Freshness */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-2.5 transition-all duration-300 relative overflow-hidden ${
              guardStates.freshnessPassed === true
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : guardStates.freshnessPassed === false
                ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                : guardStates.contextPassed !== null
                ? "border-sky-500/40 bg-sky-500/5 animate-pulse"
                : "opacity-40 border-slate-300 dark:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-black">
              <span>3. FRESHNESS</span>
              {guardStates.freshnessPassed === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {guardStates.freshnessPassed === false && <XCircle className="w-4 h-4 text-rose-500" />}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Database className="w-3.5 h-3.5 text-sky-500" />
              <span>Replay Store</span>
            </div>
            <p className="text-[10px] text-caption font-mono leading-tight">
              {guardStates.freshnessPassed === true
                ? "Fresh Nonce & Sequence"
                : guardStates.freshnessPassed === false
                ? "Consumed Nonce / Replay"
                : "Querying replay registry..."}
            </p>
          </div>

          {/* Gate 4: Execution Gate */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-2.5 transition-all duration-300 relative overflow-hidden ${
              pipelinePhase === "authorized"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : pipelinePhase === "blocked"
                ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                : "opacity-40 border-slate-300 dark:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-black">
              <span>4. GATE</span>
              {pipelinePhase === "authorized" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {pipelinePhase === "blocked" && <XCircle className="w-4 h-4 text-rose-500" />}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Send className="w-3.5 h-3.5 text-sky-500" />
              <span>Settlement Dispatch</span>
            </div>
            <p className="text-[10px] text-caption font-mono leading-tight">
              {pipelinePhase === "authorized"
                ? "AUTHORIZED"
                : pipelinePhase === "blocked"
                ? "BLOCKED"
                : "Enforcing invariant..."}
            </p>
          </div>
        </div>

        {/* Real-time Telemetry Stream Bar */}
        <div
          className="p-3 rounded-xl border flex items-center justify-between text-[11px] font-mono text-caption"
          style={{ backgroundColor: "rgb(var(--surface-muted))", borderColor: "rgb(var(--border))" }}
        >
          <span>ENCLAVE: Asia-South-1 · HARDWARE ISOLATED</span>
          <span className="text-sky-600 dark:text-sky-400 font-bold">SHA-256 CANONICAL DIGEST COMMITTED</span>
          <span>LATENCY: ~4.2ms</span>
        </div>
      </div>
    </div>
  );
};
