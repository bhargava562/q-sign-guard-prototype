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
      className="relative flex flex-col rounded-2xl border p-4 sm:p-5 shadow-sm overflow-hidden transition-all card-panel"
      style={{
        borderColor: isHeroReplay
          ? "rgba(var(--danger), 0.6)"
          : isAuthorized
          ? "rgba(var(--success), 0.6)"
          : "rgb(var(--border))",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-15"
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
            <h2 className="text-xs font-black tracking-wider uppercase text-heading flex items-center gap-2">
              <span>ACTIVE SECURITY BUS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: "rgb(var(--surface-muted))",
                      color: "rgb(var(--text-secondary))",
                    }}>
                PQC Pipeline
              </span>
            </h2>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isAuthorized && (
            <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>AUTHORIZED</span>
            </span>
          )}
          {isHeroReplay && (
            <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>REPLAY BLOCKED</span>
            </span>
          )}
          {isBlocked && !isHeroReplay && (
            <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-rose-500 text-white shadow-md">
              <XCircle className="h-3.5 w-3.5" />
              <span>VIOLATION</span>
            </span>
          )}
          {!isAuthorized && !isBlocked && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "rgb(var(--surface-muted))",
                    color: "rgb(var(--text-secondary))",
                    border: "1px solid rgb(var(--border))",
                  }}>
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
              <span>BUS READY</span>
            </span>
          )}
        </div>
      </div>

      {/* Sleek Bus Conduit Track */}
      <div className="relative my-6 px-2 sm:px-6">
        <div
          className="h-2 w-full rounded-full relative overflow-hidden"
          style={{
            backgroundColor: "rgb(var(--surface-muted))",
            border: "1px solid rgb(var(--border))",
          }}
        >
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
            className={`absolute -top-3.5 transition-all duration-500 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-lg border z-20`}
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
              color: isHeroReplay || isAuthorized ? "#ffffff" : "rgb(var(--text-primary))",
              borderColor: isHeroReplay
                ? "rgb(var(--danger))"
                : isAuthorized
                ? "rgb(var(--success))"
                : "rgb(var(--accent))",
            }}
          >
            <Sparkles className="h-3 w-3" />
            <span>◈ {activePacket.id}</span>
            <span className="opacity-75 text-[10px]">({activePacket.payload.nonce})</span>
          </div>
        )}
      </div>

      {/* The 4 Responsive Pipeline Node Hubs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 relative z-10">
        {/* NODE 1: ML-DSA Signature Guard */}
        <div
          className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
            isSigVerifying
              ? "ring-2 ring-indigo-500 shadow-md scale-[1.02]"
              : isSigPassed
              ? "border-emerald-500/60 bg-emerald-500/10"
              : isSigFailed
              ? "border-rose-500/80 bg-rose-500/10 scale-[1.02]"
              : ""
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
                    : "bg-indigo-500/20 text-indigo-400"
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
              </div>

              {isSigPassed && <span className="text-xs font-mono font-black text-emerald-500">PASS ✓</span>}
              {isSigFailed && <span className="text-xs font-mono font-black text-rose-500">FAIL ✕</span>}
              {isSigVerifying && <span className="text-[10px] font-mono font-bold text-indigo-400 animate-pulse">CHECKING</span>}
            </div>

            <h3 className="text-xs font-black uppercase tracking-wider text-heading">
              1. Signature Guard
            </h3>
            <div className="text-[11px] font-mono text-caption mt-1">
              ML-DSA-65 Integrity
            </div>
          </div>

          <div className="mt-4 pt-2 border-t flex items-center justify-between text-[11px] font-mono"
               style={{ borderColor: "rgb(var(--border))" }}>
            <span className="text-caption">Authenticity</span>
            <span className={`font-black ${isSigPassed ? "text-emerald-500" : isSigFailed ? "text-rose-500" : "text-caption"}`}>
              {isSigPassed ? "VALID" : isSigFailed ? "TAMPERED" : "AWAITING"}
            </span>
          </div>
        </div>

        {/* NODE 2: Context Guard */}
        <div
          className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
            isCtxVerifying
              ? "ring-2 ring-indigo-500 shadow-md scale-[1.02]"
              : isCtxPassed
              ? "border-emerald-500/60 bg-emerald-500/10"
              : isCtxFailed
              ? "border-rose-500/80 bg-rose-500/10 scale-[1.02]"
              : ""
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
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                <Layers className="h-5 w-5" />
              </div>

              {isCtxPassed && <span className="text-xs font-mono font-black text-emerald-500">MATCH ✓</span>}
              {isCtxFailed && <span className="text-xs font-mono font-black text-rose-500">FAIL ✕</span>}
              {isCtxVerifying && <span className="text-[10px] font-mono font-bold text-blue-400 animate-pulse">CHECKING</span>}
            </div>

            <h3 className="text-xs font-black uppercase tracking-wider text-heading">
              2. Context Guard
            </h3>
            <div className="text-[11px] font-mono text-caption mt-1">
              Identity & Session Bind
            </div>
          </div>

          <div className="mt-4 pt-2 border-t flex items-center justify-between text-[11px] font-mono"
               style={{ borderColor: "rgb(var(--border))" }}>
            <span className="text-caption">Session</span>
            <span className={`font-black ${isCtxPassed ? "text-emerald-500" : isCtxFailed ? "text-rose-500" : "text-caption"}`}>
              {isCtxPassed ? "ACTIVE" : isCtxFailed ? "INVALID" : "AWAITING"}
            </span>
          </div>
        </div>

        {/* NODE 3: Freshness & Replay Guard */}
        <div
          className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
            isFreshVerifying
              ? "ring-2 ring-indigo-500 shadow-md scale-[1.02]"
              : isFreshPassed
              ? "border-emerald-500/60 bg-emerald-500/10"
              : isFreshFailed
              ? "border-rose-500 ring-2 ring-rose-500/30 bg-rose-500/15 scale-[1.03] animate-shield-deflect"
              : ""
          }`}
          style={{
            backgroundColor: isFreshPassed || isFreshFailed ? undefined : "rgb(var(--surface-muted))",
            borderColor: isFreshPassed || isFreshFailed ? undefined : "rgb(var(--border))",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  isFreshPassed
                    ? "bg-emerald-500 text-white"
                    : isFreshFailed
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {isFreshFailed ? <ShieldAlert className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
              </div>

              {isFreshPassed && <span className="text-xs font-mono font-black text-emerald-500">FRESH ✓</span>}
              {isFreshFailed && (
                <span className="text-xs font-mono font-black text-white bg-rose-600 px-2 py-0.5 rounded-full shadow-sm">
                  REPLAYED ✕
                </span>
              )}
              {isFreshVerifying && <span className="text-[10px] font-mono font-bold text-amber-400 animate-pulse">CHECKING</span>}
            </div>

            <h3 className="text-xs font-black uppercase tracking-wider text-heading">
              3. Freshness Guard
            </h3>
            <div className="text-[11px] font-mono text-caption mt-1">
              {isFreshFailed ? "Nonce Reused" : "Nonce & Sequence"}
            </div>
          </div>

          <div className="mt-4 pt-2 border-t flex items-center justify-between text-[11px] font-mono"
               style={{ borderColor: "rgb(var(--border))" }}>
            <span className="text-caption">Replay State</span>
            <span className={`font-black ${isFreshPassed ? "text-emerald-500" : isFreshFailed ? "text-rose-500" : "text-caption"}`}>
              {isFreshPassed ? "UNSEEN" : isFreshFailed ? "BLOCKED ✕" : "AWAITING"}
            </span>
          </div>
        </div>

        {/* NODE 4: Execution Gate */}
        <div
          className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
            isAuthorized
              ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]"
              : isBlocked
              ? "border-rose-500/60 bg-rose-500/10"
              : ""
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
                    ? "bg-rose-500/20 text-rose-400"
                    : "bg-slate-500/20 text-slate-400"
                }`}
              >
                {isAuthorized ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              </div>

              <span className={`text-xs font-mono font-black ${isAuthorized ? "text-white" : isBlocked ? "text-rose-500" : "text-caption"}`}>
                {isAuthorized ? "COMMITTED" : isBlocked ? "DENIED" : "STANDBY"}
              </span>
            </div>

            <h3 className={`text-xs font-black uppercase tracking-wider ${isAuthorized ? "text-white" : "text-heading"}`}>
              4. Execution Gate
            </h3>
            <div className={`text-[11px] font-mono mt-1 ${isAuthorized ? "text-emerald-100" : "text-caption"}`}>
              {isAuthorized ? "Executed in State" : isBlocked ? "Execution Denied" : "Standby"}
            </div>
          </div>

          <div
            className="mt-4 pt-2 border-t flex items-center justify-between text-[11px] font-mono"
            style={{
              borderColor: isAuthorized ? "rgba(255,255,255,0.2)" : "rgb(var(--border))",
            }}
          >
            <span className={isAuthorized ? "text-emerald-100" : "text-caption"}>Action</span>
            <span className={`font-black ${isAuthorized ? "text-white" : isBlocked ? "text-rose-500" : "text-caption"}`}>
              {isAuthorized ? "ALLOW ✓" : isBlocked ? "BLOCK ✕" : "WAITING"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
