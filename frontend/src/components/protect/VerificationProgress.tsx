import React from "react";
import { ShieldCheck, Layers, Clock, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const VerificationProgress: React.FC = () => {
  const { selectedIncomingRequest, guardStates, pipelinePhase } = useSecurityStore();

  const isSigDone = guardStates.signaturePassed !== null;
  const isCtxDone = guardStates.contextPassed !== null;
  const isFreshDone = guardStates.freshnessPassed !== null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-8">
      <div className="w-full rounded-3xl border p-8 shadow-sm transition-all card-panel relative overflow-hidden">
        {/* Pulsing Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
            <h3 className="text-sm font-black tracking-wide uppercase text-heading">
              Verifying Transaction {selectedIncomingRequest.requestId}
            </h3>
          </div>
          <span className="text-xs font-mono text-caption">Gateway Pipeline Active</span>
        </div>

        {/* Spatial Transaction Summary */}
        <div className="text-center pb-6">
          <div className="text-2xl font-black text-heading">
            {selectedIncomingRequest.sender} ── {selectedIncomingRequest.amount} ──&gt; {selectedIncomingRequest.receiver}
          </div>
          <p className="text-xs font-mono text-caption mt-1">{selectedIncomingRequest.message}</p>
        </div>

        {/* 4 Sequential Checks */}
        <div className="space-y-3.5 pt-2">
          {/* Check 1: Authenticity */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border transition-all bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              <div>
                <span className="text-xs font-bold text-heading block">1. Cryptographic Authenticity</span>
                <span className="text-[11px] font-mono text-caption">ML-DSA-65 post-quantum signature verification</span>
              </div>
            </div>
            <div>
              {isSigDone ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> VALID
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-mono text-caption">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" /> Verifying...
                </span>
              )}
            </div>
          </div>

          {/* Check 2: Context */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border transition-all bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-indigo-500" />
              <div>
                <span className="text-xs font-bold text-heading block">2. Contextual Binding</span>
                <span className="text-[11px] font-mono text-caption">Participant identities & session legitimacy</span>
              </div>
            </div>
            <div>
              {isCtxDone ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> BOUND
                </span>
              ) : isSigDone ? (
                <span className="inline-flex items-center gap-1 text-xs font-mono text-caption">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" /> Binding...
                </span>
              ) : (
                <span className="text-xs font-mono text-caption opacity-40">Queued</span>
              )}
            </div>
          </div>

          {/* Check 3: Freshness */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border transition-all bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-indigo-500" />
              <div>
                <span className="text-xs font-bold text-heading block">3. Protocol Freshness</span>
                <span className="text-[11px] font-mono text-caption">Single-use nonce & sequence monotonic check</span>
              </div>
            </div>
            <div>
              {isFreshDone ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> FRESH
                </span>
              ) : isCtxDone ? (
                <span className="inline-flex items-center gap-1 text-xs font-mono text-caption">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" /> Evaluating...
                </span>
              ) : (
                <span className="text-xs font-mono text-caption opacity-40">Queued</span>
              )}
            </div>
          </div>

          {/* Check 4: Gate */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border transition-all bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-indigo-500" />
              <div>
                <span className="text-xs font-bold text-heading block">4. Execution Gate</span>
                <span className="text-[11px] font-mono text-caption">Atomic commit and authorization release</span>
              </div>
            </div>
            <div>
              {pipelinePhase === "authorized" ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> AUTHORIZED
                </span>
              ) : isFreshDone ? (
                <span className="inline-flex items-center gap-1 text-xs font-mono text-caption">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" /> Authorizing...
                </span>
              ) : (
                <span className="text-xs font-mono text-caption opacity-40">Queued</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
