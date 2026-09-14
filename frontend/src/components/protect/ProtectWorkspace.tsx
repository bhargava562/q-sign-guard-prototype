import React from "react";
import { useSecurityStore } from "../../store/securityStore";
import { IncomingRequestCard } from "./IncomingRequestCard";
import { VerificationProgress } from "./VerificationProgress";
import { ProcessedReceipt } from "./ProcessedReceipt";
import { DuplicateArrivalCard } from "./DuplicateArrivalCard";
import { ExecutionBlockedView } from "./ExecutionBlockedView";

export const ProtectWorkspace: React.FC = () => {
  const { operatorStage } = useSecurityStore();

  return (
    <div className="w-full flex-1 flex flex-col justify-center py-4">
      {operatorStage === "incoming" && <IncomingRequestCard />}
      {(operatorStage === "verifying" ||
        operatorStage === "duplicate-verifying" ||
        operatorStage === "invalid-test-verifying") && <VerificationProgress />}
      {operatorStage === "processed" && <ProcessedReceipt />}
      {operatorStage === "duplicate-arrived" && <DuplicateArrivalCard />}
      {operatorStage === "blocked" && <ExecutionBlockedView />}
    </div>
  );
};
