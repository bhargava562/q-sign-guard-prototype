import React, { useState } from "react";
import { Lock, Hash, Key, CheckCircle2, ChevronDown, ChevronUp, Copy, Check, ShieldCheck, Sparkles, Orbit } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const ContextBindingVisualizer: React.FC = () => {
  const { payload, activePacket, pipelinePhase, reducedMotion } = useSecurityStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isCanonicalized =
    pipelinePhase !== "idle" &&
    pipelinePhase !== "collecting" &&
    activePacket !== null;

  const handleCopy = () => {
    if (activePacket?.canonicalJson) {
      navigator.clipboard.writeText(activePacket.canonicalJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fields = [
    { label: "message", val: payload.message },
    { label: "sender", val: payload.sender },
    { label: "receiver", val: payload.receiver },
    { label: "session_id", val: payload.sessionId },
    { label: "nonce", val: payload.nonce },
    { label: "sequence", val: String(payload.sequence) },
    { label: "expires_at", val: new Date(payload.expiresAt).toLocaleTimeString() },
  ];

  return (
    <div
      className="relative rounded-2xl border p-4 sm:p-5 shadow-sm transition-all overflow-hidden"
      style={{
        backgroundColor: "rgba(var(--surface), 0.9)",
        borderColor: "rgb(var(--border))",
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "rgb(var(--accent-soft))",
              color: "rgb(var(--accent))",
            }}
          >
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>CANONICAL CONTEXT FUSION CORE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                RFC 8785
              </span>
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--foreground))" }}
        >
          <span>{isExpanded ? "Hide JCS" : "Inspect JCS"}</span>
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Dynamic Fusion Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left: Input Fields Chips */}
        <div className="lg:col-span-5 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Context Inputs Bound to Commitment:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {fields.map((f) => (
              <div
                key={f.label}
                className="rounded-lg border px-2.5 py-1.5 text-[11px] font-mono flex flex-col justify-center"
                style={{
                  backgroundColor: "rgb(var(--surface-muted))",
                  borderColor: "rgb(var(--border))",
                }}
              >
                <span className="text-[9px] text-slate-400 uppercase font-bold">{f.label}</span>
                <span className="truncate font-semibold text-slate-700 dark:text-slate-200">{f.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Animated Rotating Holographic Reactor */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center py-2">
          <div className="relative flex items-center justify-center w-24 h-24">
            {/* Outer spinning orbit ring */}
            <div
              className={`absolute inset-0 rounded-full border-2 border-dashed border-indigo-400/40 ${
                reducedMotion ? "" : "animate-core-spin"
              }`}
            />
            {/* Inner counter-rotating ring */}
            <div
              className={`absolute inset-2 rounded-full border-2 border-dotted border-cyan-400/50 ${
                reducedMotion ? "" : "animate-core-spin-reverse"
              }`}
            />
            {/* Core icon */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform"
              style={{
                backgroundColor: isCanonicalized ? "rgb(var(--accent))" : "rgb(var(--surface-muted))",
                color: isCanonicalized ? "#ffffff" : "rgb(var(--foreground))",
              }}
            >
              {isCanonicalized ? <ShieldCheck className="h-6 w-6" /> : <Orbit className="h-6 w-6 text-slate-400" />}
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold mt-2 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Deterministic JCS Core
          </span>
        </div>

        {/* Right: Cryptographic Commitment Outputs */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div
            className="rounded-xl border p-3"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: activePacket ? "rgba(var(--accent), 0.4)" : "rgb(var(--border))",
            }}
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span className="flex items-center gap-1">
                <Hash className="h-3.5 w-3.5 text-indigo-500" />
                <span>SHA-256 Context Hash</span>
              </span>
              {activePacket && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
            </div>
            <div className="text-xs font-mono font-bold mt-1 text-slate-800 dark:text-slate-200 truncate">
              {activePacket ? activePacket.contextHashHex : "0x8f4d92...e7b1a0"}
            </div>
          </div>

          <div
            className="rounded-xl border p-3"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: activePacket ? "rgba(var(--success), 0.4)" : "rgb(var(--border))",
            }}
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span className="flex items-center gap-1">
                <Key className="h-3.5 w-3.5 text-emerald-500" />
                <span>ML-DSA-65 Signature</span>
              </span>
              {activePacket && <Sparkles className="h-3 w-3 text-emerald-500" />}
            </div>
            <div className="text-xs font-mono font-bold mt-1 text-emerald-700 dark:text-emerald-300 truncate">
              {activePacket ? activePacket.signatureHex : "sig_mldsa65_..."}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable RFC 8785 JSON Inspector */}
      {isExpanded && activePacket && (
        <div
          className="mt-4 rounded-xl border p-3.5 text-xs font-mono transition-all"
          style={{
            backgroundColor: "rgb(var(--surface-muted))",
            borderColor: "rgb(var(--border))",
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b mb-2" style={{ borderColor: "rgb(var(--border))" }}>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Canonical JCS Payload (RFC 8785)
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="text-slate-800 dark:text-slate-200 overflow-x-auto p-2.5 rounded bg-white dark:bg-slate-900 border text-[11px]">
            {JSON.stringify(JSON.parse(activePacket.canonicalJson), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
