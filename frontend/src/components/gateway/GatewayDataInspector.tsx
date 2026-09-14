import React from "react";
import { Layers, Hash, Cpu, Database, Activity, CheckCircle2, XCircle } from "lucide-react";
import type { SignedTransactionPacket } from "../../types/transaction";
import type { GatewayTraceEvent } from "../../types/gatewayTrace";

interface GatewayDataInspectorProps {
  packet: SignedTransactionPacket | null;
  activeEvent: GatewayTraceEvent | null;
}

export const GatewayDataInspector: React.FC<GatewayDataInspectorProps> = ({
  packet,
  activeEvent,
}) => {
  if (!packet) return null;

  const stageName = activeEvent ? activeEvent.stage.toUpperCase() : "AWAITING TRANSIT";
  const isSuccess = activeEvent?.status === "success";
  const isFailure = activeEvent?.status === "failure";

  return (
    <div
      className="w-full rounded-2xl border p-4 sm:p-5 flex flex-col gap-3 font-mono text-xs transition-all shadow-sm"
      style={{
        backgroundColor: "rgb(var(--surface))",
        borderColor: "rgb(var(--border))",
      }}
    >
      {/* Top Status Banner with Real-time Event Stage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase text-caption tracking-wider">
            Active Stage Inspector
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
            {stageName}
          </span>
          {activeEvent && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                isSuccess
                  ? "bg-emerald-500/15 text-emerald-500"
                  : isFailure
                  ? "bg-red-500/15 text-red-500"
                  : "bg-sky-500/15 text-sky-400"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : isFailure ? (
                <XCircle className="w-3 h-3" />
              ) : null}
              {activeEvent.status.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Real-time Operation Telemetry */}
      {activeEvent && (
        <div
          className="p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          style={{ backgroundColor: "rgb(var(--surface-muted))", borderColor: "rgb(var(--border))" }}
        >
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-caption font-semibold">OPERATION:</span>
            <span className="text-heading font-bold">{activeEvent.operation}</span>
          </div>
          {activeEvent.timestamp && (
            <span className="text-[10px] text-slate-500">{activeEvent.timestamp}</span>
          )}
        </div>
      )}

      {/* Grid of transformed layers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Layer 1: Canonical JCS Serialization */}
        <div
          className="p-3 rounded-xl border flex flex-col gap-2"
          style={{ backgroundColor: "rgb(var(--surface-muted))", borderColor: "rgb(var(--border))" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-caption uppercase font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-sky-500" />
              <span>RFC 8785 Canonical Context (JCS)</span>
            </span>
            <span className="text-[10px] text-emerald-500 font-bold">
              {packet.canonicalJson.length} BYTES
            </span>
          </div>

          <pre className="p-2 rounded-lg bg-slate-950 text-emerald-400 text-[10px] leading-relaxed overflow-x-auto max-h-24 border border-slate-800">
            {packet.canonicalJson}
          </pre>
        </div>

        {/* Layer 2: SHA-256 Digest & ML-DSA */}
        <div
          className="p-3 rounded-xl border flex flex-col gap-2 justify-between"
          style={{ backgroundColor: "rgb(var(--surface-muted))", borderColor: "rgb(var(--border))" }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-caption uppercase font-semibold flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-sky-500" />
              <span>SHA-256 Context Commitment Digest</span>
            </span>
            <span className="p-1.5 rounded-lg bg-slate-950 text-sky-400 text-[10px] truncate border border-slate-800">
              {packet.contextHashHex}
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t" style={{ borderColor: "rgb(var(--border))" }}>
            <span className="text-[10px] text-caption uppercase font-semibold flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-sky-500" />
              <span>ML-DSA-65 Demonstration Provider Signature</span>
            </span>
            <span className="p-1.5 rounded-lg bg-slate-950 text-indigo-300 text-[10px] truncate border border-slate-800">
              {packet.signatureHex}
            </span>
          </div>
        </div>
      </div>

      {/* Layer 3: Stateful Replay Store Query */}
      <div
        className="p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono"
        style={{ backgroundColor: "rgb(var(--surface-muted))", borderColor: "rgb(var(--border))" }}
      >
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-sky-500" />
          <span className="text-caption font-semibold text-[11px]">REPLAY STORE LOOKUP:</span>
          <span className="font-bold text-heading text-[11px]">
            {packet.payload.sessionId} : {packet.payload.nonce}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-caption">SEQUENCE:</span>
          <span className="font-bold text-heading">{packet.payload.sequence}</span>
        </div>
      </div>
    </div>
  );
};
