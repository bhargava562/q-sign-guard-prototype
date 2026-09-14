import React from "react";
import { Radio } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";
import { GatewayPacket } from "./GatewayPacket";
import { GatewayPipelineGraph } from "./GatewayPipelineGraph";
import { GatewayTraceTerminal } from "./GatewayTraceTerminal";
import { GatewayDataInspector } from "./GatewayDataInspector";
import { ProcessingStageRenderer } from "./visualization/ProcessingStageRenderer";

export const GatewayProcessingView: React.FC = () => {
  const {
    selectedTransaction,
    activePacket,
    traceEvents,
    activeTraceEvent,
    activeNodeId,
    lastDecision,
  } = useSecurityStore();

  if (!selectedTransaction) return null;

  const currentStatus =
    lastDecision?.status === "blocked"
      ? "failure"
      : lastDecision?.status === "accepted"
      ? "success"
      : "running";

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-4">
      {/* 1. Processing View Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4" style={{ borderColor: "rgb(var(--border))" }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
            <h2 className="text-xl sm:text-2xl font-black text-heading tracking-tight">
              Gateway Processing Observatory
            </h2>
          </div>
          <p className="text-xs text-caption font-mono mt-0.5">
            Real-time execution of RFC 8785 canonicalization & NIST FIPS 204 invariant verification
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-mono font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ENCLAVE: Asia-South-1 · PROTOCOL OBSERVATORY</span>
          </div>
        </div>
      </div>

      {/* 2. Physically Moving Transaction Packet */}
      <GatewayPacket
        transaction={selectedTransaction}
        currentStageId={activeNodeId}
        status={currentStatus}
      />

      {/* 3. DOMINANT VISUAL CENTER STAGE: Protocol Stage Execution Observatory */}
      <div
        className="w-full rounded-3xl border shadow-2xl relative overflow-hidden transition-all"
        style={{
          backgroundColor: "rgb(var(--surface))",
          borderColor: "rgb(var(--border))",
        }}
      >
        <ProcessingStageRenderer
          packet={activePacket}
          event={activeTraceEvent}
        />
      </div>

      {/* 4. 8-Station Connected Pipeline Graph */}
      <div
        className="rounded-3xl border p-4 sm:p-6 shadow-md relative overflow-hidden"
        style={{
          backgroundColor: "rgb(var(--surface))",
          borderColor: "rgb(var(--border))",
        }}
      >
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono font-bold text-caption uppercase tracking-wider">
          <span>Security Pipeline Stations</span>
          <span className="text-sky-500">
            {activeNodeId ? `Active Station: ${activeNodeId.toUpperCase()}` : "Ready"}
          </span>
        </div>
        <GatewayPipelineGraph activeStageId={activeNodeId} />
      </div>

      {/* 5. Synchronized Technical Telemetry Split (Terminal & Dynamic Data Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Real-time Stage & Layer Inspector */}
        <GatewayDataInspector
          packet={activePacket}
          activeEvent={activeTraceEvent}
        />

        {/* Streaming Live Monospace Terminal */}
        <GatewayTraceTerminal
          events={traceEvents}
          activeEvent={activeTraceEvent}
        />
      </div>
    </div>
  );
};
