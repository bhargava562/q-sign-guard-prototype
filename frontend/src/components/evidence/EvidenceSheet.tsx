import React, { useState } from "react";
import { X, Copy, Check, ShieldCheck, Layers, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const EvidenceSheet: React.FC = () => {
  const { evidenceDrawerOpen, closeEvidenceSheet, activeEvidencePacket, activeEvidenceDecision } = useSecurityStore();
  const [copied, setCopied] = useState(false);

  if (!evidenceDrawerOpen || !activeEvidencePacket) return null;

  const packet = activeEvidencePacket;
  const decision = activeEvidenceDecision;
  const isAccepted = decision?.status === "accepted";

  const handleCopyJson = () => {
    if (packet.canonicalJson) {
      navigator.clipboard.writeText(packet.canonicalJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      {/* Click outside to close */}
      <div className="flex-1" onClick={closeEvidenceSheet} />

      {/* Slide-over Drawer Panel */}
      <div className="w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                isAccepted
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-500 border border-rose-500/30"
              }`}
            >
              {isAccepted ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-black text-heading">Verification Evidence Sheet</h2>
              <span className="text-xs font-mono text-caption">Request ID: {packet.id}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeEvidenceSheet}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-caption hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Gateway Decision Summary */}
          <div
            className={`p-4 rounded-2xl border ${
              isAccepted
                ? "bg-emerald-500/5 border-emerald-500/30"
                : "bg-rose-500/5 border-rose-500/30"
            }`}
          >
            <span className="text-[10px] font-mono uppercase font-bold text-caption block">
              Enforcement Decision
            </span>
            <div className="flex items-center justify-between mt-1">
              <span
                className={`text-lg font-black ${
                  isAccepted ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {decision?.execution === "authorized" ? "EXECUTION AUTHORIZED" : "EXECUTION BLOCKED"}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded font-bold bg-slate-200 dark:bg-slate-800 text-heading">
                {decision?.ruleViolated || "NONE"}
              </span>
            </div>
            <p className="text-xs text-caption mt-2 leading-relaxed">{decision?.reason}</p>
            <div className="flex items-center justify-between text-[11px] font-mono text-caption mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
              <span>Simulation Latency: {decision?.simulationLatencyMs ?? 4.2} ms</span>
              <span>Evaluated: {new Date(decision?.evaluatedAt || Date.now()).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Section 2: Cryptographic Authenticity */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-heading flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                <span>1. Cryptographic Origin (ML-DSA-65)</span>
              </span>
              <span
                className={`text-xs font-bold ${
                  decision?.authenticity === "valid" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {decision?.authenticity === "valid" ? "VALID SIGNATURE ✓" : "SIGNATURE MISMATCH ✕"}
              </span>
            </div>
            <p className="text-xs text-caption mb-3">
              Verifies the post-quantum digital signature against the SHA-256 digest of the canonical context.
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-caption text-[10px] block">ML-DSA-65 Signature Snippet:</span>
                <span className="text-heading truncate block mt-0.5">{packet.signatureHex}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-caption text-[10px] block">Public Key Fingerprint:</span>
                <span className="text-heading truncate block mt-0.5">{packet.publicKeyHex}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Canonical Context Binding (RFC 8785) */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-heading flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-indigo-500" />
                <span>2. Canonical Context Binding (RFC 8785)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy JSON"}</span>
              </button>
            </div>
            <p className="text-xs text-caption mb-3">
              All transaction fields are lexicographically sorted to eliminate serialization ambiguities prior to hashing.
            </p>
            <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 max-h-48 leading-relaxed">
              {packet.canonicalJson}
            </pre>
            <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <span className="text-caption text-[10px] block">SHA-256 Context Commitment Hash:</span>
              <span className="text-indigo-600 dark:text-indigo-400 truncate block mt-0.5">
                {packet.contextHashHex}
              </span>
            </div>
          </div>

          {/* Section 4: Protocol Freshness & Replay State */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-heading flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span>3. Protocol Freshness & Invariant State</span>
              </span>
              <span
                className={`text-xs font-bold ${
                  decision?.ruleViolated === "REPLAY_NONCE_REUSED" ? "text-rose-500" : "text-emerald-500"
                }`}
              >
                {decision?.ruleViolated === "REPLAY_NONCE_REUSED" ? "NONCE REUSED ✕" : "FRESH NONCE ✓"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-caption text-[10px] block">SESSION ID:</span>
                <span className="text-heading font-semibold">{packet.payload.sessionId}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-caption text-[10px] block">NONCE:</span>
                <span className="text-heading font-semibold">{packet.payload.nonce}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-caption text-[10px] block">SEQUENCE:</span>
                <span className="text-heading font-semibold">{packet.payload.sequence}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-caption text-[10px] block">REPLAY STATUS:</span>
                <span
                  className={`font-semibold ${
                    decision?.ruleViolated === "REPLAY_NONCE_REUSED" ? "text-rose-500" : "text-emerald-500"
                  }`}
                >
                  {decision?.ruleViolated === "REPLAY_NONCE_REUSED" ? "CONSUMED" : "COMMITTED"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={closeEvidenceSheet}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-800 text-heading hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close Evidence Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
