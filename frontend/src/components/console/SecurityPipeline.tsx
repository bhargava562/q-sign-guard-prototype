import React from "react";
import { ShieldCheck, Layers, Clock, CheckCircle2, XCircle, ShieldAlert, Cpu, Sparkles } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const SecurityPipeline: React.FC = () => {
  const { activePacket, pipelinePhase, guardStates, reducedMotion } = useSecurityStore();

  const isSigVerifying = pipelinePhase === "verifying-signature";
  const isSigPassed = guardStates.signaturePassed === true;
  const isSigFailed = guardStates.signaturePassed === false;

  const isCtxVerifying = pipelinePhase === "checking-context";
  const isCtxPassed = guardStates.contextPassed === true;
  const isCtxFailed = guardStates.contextPassed === false;

  const isFreshVerifying = pipelinePhase === "checking-freshness";
  const isFreshPassed = guardStates.freshnessPassed === true;
  const isFreshFailed = guardStates.freshnessPassed === false;

  const isAuthorized = pipelinePhase === "authorized";
  const isBlocked = pipelinePhase === "blocked";
  const isHeroReplay = isSigPassed && isCtxPassed && isFreshFailed;

  // Determine active step index: 0 = idle, 1 = sig, 2 = ctx, 3 = freshness, 4 = exec
  let activeStep = 0;
  if (isSigVerifying) activeStep = 1;
  else if (isCtxVerifying) activeStep = 2;
  else if (isFreshVerifying) activeStep = 3;
  else if (isAuthorized) activeStep = 4;
  else if (isBlocked) {
    if (isSigFailed) activeStep = 1;
    else if (isCtxFailed) activeStep = 2;
    else if (isFreshFailed) activeStep = 3;
  }

  return (
    <div
      className="relative flex flex-col rounded-2xl border p-4 sm:p-6 shadow-sm overflow-hidden transition-all backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(var(--surface), 0.95)",
        borderColor: isHeroReplay
          ? "rgba(var(--danger), 0.5)"
          : isAuthorized
          ? "rgba(var(--success), 0.5)"
          : "rgb(var(--border))",
      }}
    >
      {/* Background neon laser grid glow */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-20"
        style={{
          backgroundColor: isHeroReplay
            ? "rgb(var(--danger))"
            : isAuthorized
            ? "rgb(var(--success))"
            : "rgb(var(--accent))",
        }}
      />

      <div className="flex items-center justify-between pb-3 border-b relative z-10" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm"
            style={{
              backgroundColor: "rgb(var(--accent-soft))",
              color: "rgb(var(--accent))",
            }}
          >
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>ACTIVE SECURITY BUS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                PQC Gateway Pipeline
              </span>
            </h2>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isAuthorized && (
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
              <span>AUTHORIZED</span>
            </span>
          )}
          {isHeroReplay && (
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/20 animate-pulse">
              <ShieldAlert className="h-4 w-4" />
              <span>REPLAY BLOCKED</span>
            </span>
          )}
          {isBlocked && !isHeroReplay && (
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-rose-500 text-white shadow-md">
              <XCircle className="h-4 w-4" />
              <span>POLICY VIOLATION</span>
            </span>
          )}
          {!isAuthorized && !isBlocked && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full text-slate-500 bg-slate-100 dark:bg-slate-800">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
              <span>BUS READY</span>
            </span>
          )}
        </div>
      </div>

      {/* Visual Bus Conduit Track with Animated Packet Slider */}
      <div className="relative my-6 px-2 sm:px-6">
        {/* The Conduit Line Track */}
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${reducedMotion ? "" : "animate-laser"}`}
            style={{
              width:
                activeStep === 0
                  ? "0%"
                  : activeStep === 1
                  ? "25%"
                  : activeStep === 2
                  ? "50%"
                  : activeStep === 3
                  ? "75%"
                  : "100%",
              backgroundColor: isHeroReplay
                ? "rgb(var(--danger))"
                : isBlocked
                ? "rgb(var(--danger))"
                : "rgb(var(--accent))",
            }}
          />
        </div>

        {/* Visual Animated Packet Capsule */}
        {activePacket && (
          <div
            className={`absolute -top-4 transition-all duration-500 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-lg border z-20 ${
              reducedMotion ? "" : "hover:scale-105"
            }`}
            style={{
              left:
                activeStep === 0
                  ? "0%"
                  : activeStep === 1
                  ? "12%"
                  : activeStep === 2
                  ? "38%"
                  : activeStep === 3
                  ? "62%"
                  : "88%",
              transform: "translateX(-50%)",
              backgroundColor: isHeroReplay
                ? "rgb(var(--danger))"
                : isAuthorized
                ? "rgb(var(--success))"
                : "rgb(var(--surface))",
              color: isHeroReplay || isAuthorized ? "#ffffff" : "rgb(var(--foreground))",
              borderColor: isHeroReplay
                ? "rgb(var(--danger))"
                : isAuthorized
                ? "rgb(var(--success))"
                : "rgb(var(--accent))",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>◈ {activePacket.id}</span>
            <span className="opacity-75 text-[10px]">({activePacket.payload.nonce})</span>
          </div>
        )}
      </div>

      {/* The 4 Responsive Pipeline Node Hubs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1 relative z-10">
        {/* NODE 1: ML-DSA Signature Guard */}
        <div
          className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
            isSigVerifying
              ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]"
              : isSigPassed
              ? "border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/20"
              : isSigFailed
              ? "border-rose-500/80 bg-rose-50/50 dark:bg-rose-950/30 scale-[1.02]"
              : "opacity-80"
          }`}
          style={{
            backgroundColor: isSigPassed || isSigFailed ? undefined : "rgb(var(--surface-muted))",
            borderColor: isSigPassed || isSigFailed ? undefined : "rgb(var(--border))",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  isSigPassed
                    ? "bg-emerald-500 text-white"
                    : isSigFailed
                    ? "bg-rose-500 text-white"
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
              </div>

              {isSigPassed && <span className="text-xs font-extrabold text-emerald-600 font-mono">PASS ✓</span>}
              {isSigFailed && <span className="text-xs font-extrabold text-rose-600 font-mono">FAIL ✕</span>}
              {isSigVerifying && <span className="text-[10px] font-bold text-indigo-600 animate-pulse font-mono">VERIFYING...</span>}
            </div>

            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              1. Signature Guard
            </h3>
            <div className="text-[11px] font-mono text-slate-500 mt-1">
              ML-DSA-65 Integrity
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Authenticity</span>
            <span className={`font-bold ${isSigPassed ? "text-emerald-600" : isSigFailed ? "text-rose-600" : "text-slate-400"}`}>
              {isSigPassed ? "VALID" : isSigFailed ? "TAMPERED" : "AWAITING"}
            </span>
          </div>
        </div>

        {/* NODE 2: Context Guard */}
        <div
          className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
            isCtxVerifying
              ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]"
              : isCtxPassed
              ? "border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/20"
              : isCtxFailed
              ? "border-rose-500/80 bg-rose-50/50 dark:bg-rose-950/30 scale-[1.02]"
              : "opacity-80"
          }`}
          style={{
            backgroundColor: isCtxPassed || isCtxFailed ? undefined : "rgb(var(--surface-muted))",
            borderColor: isCtxPassed || isCtxFailed ? undefined : "rgb(var(--border))",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  isCtxPassed
                    ? "bg-emerald-500 text-white"
                    : isCtxFailed
                    ? "bg-rose-500 text-white"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                }`}
              >
                <Layers className="h-5 w-5" />
              </div>

              {isCtxPassed && <span className="text-xs font-extrabold text-emerald-600 font-mono">MATCH ✓</span>}
              {isCtxFailed && <span className="text-xs font-extrabold text-rose-600 font-mono">FAIL ✕</span>}
              {isCtxVerifying && <span className="text-[10px] font-bold text-blue-600 animate-pulse font-mono">CHECKING...</span>}
            </div>

            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              2. Context Guard
            </h3>
            <div className="text-[11px] font-mono text-slate-500 mt-1">
              Identity & Session Bind
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Session</span>
            <span className={`font-bold ${isCtxPassed ? "text-emerald-600" : isCtxFailed ? "text-rose-600" : "text-slate-400"}`}>
              {isCtxPassed ? "ACTIVE" : isCtxFailed ? "INVALID" : "AWAITING"}
            </span>
          </div>
        </div>

        {/* NODE 3: Freshness & Replay Guard (HERO DEFLECTION SHIELD) */}
        <div
          className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
            isFreshVerifying
              ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]"
              : isFreshPassed
              ? "border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/20"
              : isFreshFailed
              ? "border-rose-500 ring-4 ring-rose-500/30 bg-rose-50/70 dark:bg-rose-950/40 scale-[1.03] animate-shield-deflect"
              : "opacity-80"
          }`}
          style={{
            backgroundColor: isFreshPassed || isFreshFailed ? undefined : "rgb(var(--surface-muted))",
            borderColor: isFreshPassed || isFreshFailed ? undefined : "rgb(var(--border))",
          }}
        >
          {/* Animated Red Deflection Wave on Replay */}
          {isFreshFailed && (
            <div className="absolute inset-0 rounded-2xl border-2 border-rose-500 animate-ping opacity-30 pointer-events-none" />
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  isFreshPassed
                    ? "bg-emerald-500 text-white"
                    : isFreshFailed
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {isFreshFailed ? <ShieldAlert className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
              </div>

              {isFreshPassed && <span className="text-xs font-extrabold text-emerald-600 font-mono">FRESH ✓</span>}
              {isFreshFailed && (
                <span className="text-xs font-extrabold text-white bg-rose-600 px-2 py-0.5 rounded-full font-mono shadow-sm">
                  REPLAYED ✕
                </span>
              )}
              {isFreshVerifying && <span className="text-[10px] font-bold text-amber-600 animate-pulse font-mono">TESTING...</span>}
            </div>

            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              3. Freshness Guard
            </h3>
            <div className="text-[11px] font-mono text-slate-500 mt-1">
              {isFreshFailed ? "Nonce Already Consumed" : "Nonce & Sequence"}
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Replay State</span>
            <span className={`font-bold ${isFreshPassed ? "text-emerald-600" : isFreshFailed ? "text-rose-600" : "text-slate-400"}`}>
              {isFreshPassed ? "UNSEEN" : isFreshFailed ? "BLOCKED ✕" : "AWAITING"}
            </span>
          </div>
        </div>

        {/* NODE 4: Execution Gate */}
        <div
          className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
            isAuthorized
              ? "border-emerald-500 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 scale-[1.02]"
              : isBlocked
              ? "border-rose-500/70 bg-rose-50/40 dark:bg-rose-950/20"
              : "opacity-80"
          }`}
          style={{
            backgroundColor: isAuthorized ? undefined : isBlocked ? undefined : "rgb(var(--surface-muted))",
            borderColor: isAuthorized ? undefined : isBlocked ? undefined : "rgb(var(--border))",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  isAuthorized
                    ? "bg-white text-emerald-600"
                    : isBlocked
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {isAuthorized ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              </div>

              <span className={`text-xs font-mono font-extrabold ${isAuthorized ? "text-white" : isBlocked ? "text-rose-600" : "text-slate-400"}`}>
                {isAuthorized ? "COMMITTED" : isBlocked ? "DENIED" : "GATE"}
              </span>
            </div>

            <h3 className={`text-xs font-extrabold uppercase tracking-wide ${isAuthorized ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
              4. Execution Gate
            </h3>
            <div className={`text-[11px] font-mono mt-1 ${isAuthorized ? "text-emerald-100" : "text-slate-500"}`}>
              {isAuthorized ? "Executed in State" : isBlocked ? "Execution Prevented" : "Standby"}
            </div>
          </div>

          <div
            className="mt-4 pt-2.5 border-t flex items-center justify-between text-[11px] font-mono"
            style={{
              borderColor: isAuthorized ? "rgba(255,255,255,0.2)" : "rgba(148, 163, 184, 0.2)",
            }}
          >
            <span className={isAuthorized ? "text-emerald-100" : "text-slate-400"}>Action</span>
            <span className={`font-bold ${isAuthorized ? "text-white" : isBlocked ? "text-rose-600" : "text-slate-400"}`}>
              {isAuthorized ? "ALLOW ✓" : isBlocked ? "BLOCK ✕" : "WAITING"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
