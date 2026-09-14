import React from "react";
import { Radio } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";
import { GatewayPacket } from "./GatewayPacket";
import { GatewayPipelineGraph } from "./GatewayPipelineGraph";
import { GatewayTraceTerminal } from "./GatewayTraceTerminal";
import { GatewayDataInspector } from "./GatewayDataInspector";

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
      {/* Processing View Banner */}
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
            <span>ENCLAVE: Asia-South-1 · ACTIVE PIPELINE</span>
          </div>
        </div>
      </div>

      {/* 1. Physically Moving Transaction Packet */}
      <GatewayPacket
        transaction={selectedTransaction}
        currentStageId={activeNodeId}
        status={currentStatus}
      />

      {/* 2. Gateway Pipeline Graph (8 Stations) */}
      <div
        className="rounded-3xl border p-5 sm:p-7 shadow-lg relative overflow-hidden"
        style={{
          backgroundColor: "rgb(var(--surface))",
          borderColor: "rgb(var(--border))",
        }}
      >
        <GatewayPipelineGraph activeStageId={activeNodeId} />
      </div>

      {/* 3. Real-Time Data Transformation Inspector */}
      <GatewayDataInspector
        packet={activePacket}
        activeEvent={activeTraceEvent}
      />

      {/* 4. Live Gateway Trace Terminal Logs */}
      <GatewayTraceTerminal
        events={traceEvents}
        activeEvent={activeTraceEvent}
      />
    </div>
  );
};
