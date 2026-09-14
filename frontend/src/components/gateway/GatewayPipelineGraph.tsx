import React from "react";
import { GATEWAY_PIPELINE_NODES, type GatewayTraceStage } from "../../types/gatewayTrace";
import { GatewayNode } from "./GatewayNode";
import { useSecurityStore } from "../../store/securityStore";

interface GatewayPipelineGraphProps {
  activeStageId: GatewayTraceStage | null;
}

export const GatewayPipelineGraph: React.FC<GatewayPipelineGraphProps> = ({ activeStageId }) => {
  const { traceEvents } = useSecurityStore();

  const getStageStatus = (stageId: GatewayTraceStage) => {
    const event = traceEvents.find((e) => e.stage === stageId);
    if (!event) {
      return activeStageId === stageId ? "running" : "idle";
    }
    return event.status;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs font-mono text-caption">
        <span className="uppercase font-bold tracking-wider">
          Enclave Pipeline Graph
        </span>
        <span>RFC 8785 & NIST FIPS 204 Architecture</span>
      </div>

      {/* Grid of Pipeline Stations */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
        {GATEWAY_PIPELINE_NODES.map((node) => {
          const status = getStageStatus(node.id);
          const isActive = activeStageId === node.id;

          return (
            <GatewayNode
              key={node.id}
              id={node.id}
              label={node.label}
              subLabel={node.subLabel}
              stepNumber={node.stepNumber}
              isActive={isActive}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
};
