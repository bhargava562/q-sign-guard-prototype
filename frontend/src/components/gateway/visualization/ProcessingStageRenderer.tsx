import React from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SignedTransactionPacket } from "../../../types/transaction";
import type { GatewayTraceEvent } from "../../../types/gatewayTrace";
import { PacketIngressAnimation } from "./PacketIngressAnimation";
import { PayloadParsingAnimation } from "./PayloadParsingAnimation";
import { CanonicalizationAnimation } from "./CanonicalizationAnimation";
import { HashComputationAnimation } from "./HashComputationAnimation";
import { SignatureVerificationAnimation } from "./SignatureVerificationAnimation";
import { ContextBindingAnimation } from "./ContextBindingAnimation";
import { ReplayStoreAnimation } from "./ReplayStoreAnimation";
import { ExecutionGateAnimation } from "./ExecutionGateAnimation";

interface ProcessingStageRendererProps {
  packet: SignedTransactionPacket | null;
  event: GatewayTraceEvent | null;
}

export const ProcessingStageRenderer: React.FC<ProcessingStageRendererProps> = ({
  packet,
  event,
}) => {
  if (!packet) return null;

  const currentStage = event?.stage || "received";

  return (
    <div className="w-full relative min-h-[340px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full"
        >
          {(() => {
            switch (currentStage) {
              case "received":
                return <PacketIngressAnimation packet={packet} event={event} />;
              case "parsed":
                return <PayloadParsingAnimation packet={packet} event={event} />;
              case "canonicalized":
                return <CanonicalizationAnimation packet={packet} event={event} />;
              case "hashed":
                return <HashComputationAnimation packet={packet} event={event} />;
              case "signature-verification":
                return <SignatureVerificationAnimation packet={packet} event={event} />;
              case "context-resolution":
                return <ContextBindingAnimation packet={packet} event={event} />;
              case "replay-check":
                return <ReplayStoreAnimation packet={packet} event={event} />;
              case "execution-gate":
              case "committed":
              case "blocked":
                return <ExecutionGateAnimation packet={packet} event={event} />;
              default:
                return <PacketIngressAnimation packet={packet} event={event} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
