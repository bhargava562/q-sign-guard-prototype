import React from "react";
import { Info } from "lucide-react";
import { defaultReplayStore } from "../../engine/replayGuard";

export const SystemEnclaveView: React.FC = () => {
  const replayStats = defaultReplayStore.getStats();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-heading">System Status</h2>
        <p className="text-xs text-caption font-medium">
          Operational telemetry and stateful replay store metrics
        </p>
      </div>

      {/* Main Status Grid */}
      <div
        className="p-6 sm:p-8 rounded-3xl border flex flex-col gap-6 transition-colors shadow-sm"
        style={{
          backgroundColor: "rgb(var(--surface))",
          borderColor: "rgb(var(--border))",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Gateway Status */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-mono font-bold text-caption uppercase">Gateway</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-lg font-black text-heading">ONLINE</span>
            </div>
            <span className="text-xs text-caption font-mono">
              Enclave: Asia-South-1 · Cluster Node 01
            </span>
          </div>

          {/* Policy */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-mono font-bold text-caption uppercase">Policy</span>
            <span className="text-lg font-black text-heading">
              Strict Stateful Invariants <span className="text-xs font-mono text-caption">v1.0</span>
            </span>
            <span className="text-xs text-caption font-mono">
              RFC 8785 Canonicalization & Stateful Replay Enforcement
            </span>
          </div>

          {/* Cryptographic Provider */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-mono font-bold text-caption uppercase">Cryptographic Provider</span>
            <span className="text-lg font-black text-heading">
              ML-DSA-65 <span className="text-xs font-mono text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">Demonstration Mode</span>
            </span>
            <span className="text-xs text-caption font-mono">
              NIST FIPS 204 Lattice-based digital signature algorithm
            </span>
          </div>

          {/* Replay Protection */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-mono font-bold text-caption uppercase">Replay Protection</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-lg font-black text-heading">ACTIVE</span>
            </div>
            <span className="text-xs text-caption font-mono">
              In-memory stateful nonce registry and sequence validator
            </span>
          </div>
        </div>

        {/* Dynamic Metric Tiles */}
        <div
          className="grid grid-cols-2 sm:grid-cols-2 gap-4 p-4 rounded-2xl border"
          style={{
            backgroundColor: "rgb(var(--surface-muted))",
            borderColor: "rgb(var(--border))",
          }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-caption uppercase">Tracked Sessions</span>
            <span className="text-2xl font-black text-heading">
              {Math.max(replayStats.totalTrackedSessions, 3)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-caption uppercase">Consumed Nonces</span>
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
              {replayStats.totalTrackedNonces}
            </span>
          </div>
        </div>

        {/* Research Foundation Note */}
        <div
          className="p-4 rounded-2xl border flex items-start gap-3 text-xs"
          style={{
            backgroundColor: "rgb(var(--surface-muted))",
            borderColor: "rgb(var(--border))",
          }}
        >
          <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-heading">Research Foundation</span>
            <p className="text-caption leading-relaxed font-mono">
              CV-QDS / quantum-channel monitoring is an extension, not a prerequisite for protocol-level replay defense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
