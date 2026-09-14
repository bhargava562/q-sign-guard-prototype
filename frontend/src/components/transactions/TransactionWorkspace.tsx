import React from "react";
import { useSecurityStore } from "../../store/securityStore";
import { TransactionInbox } from "../inbox/TransactionInbox";
import { TransactionReview } from "../review/TransactionReview";
import { SecurityCorridor } from "../gateway/SecurityCorridor";
import { ExecutionReceipt } from "../result/ExecutionReceipt";

export const TransactionWorkspace: React.FC = () => {
  const { operatorViewMode } = useSecurityStore();

  return (
    <div className="w-full flex flex-col transition-all">
      {operatorViewMode === "inbox" && <TransactionInbox />}
      {operatorViewMode === "review" && <TransactionReview />}
      {operatorViewMode === "corridor" && <SecurityCorridor />}
      {operatorViewMode === "receipt" && <ExecutionReceipt />}
    </div>
  );
};
