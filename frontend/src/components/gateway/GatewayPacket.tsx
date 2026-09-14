import React from "react";
import { Lock, AlertOctagon, CheckCircle2 } from "lucide-react";
import type { InboxTransactionItem } from "../../types/transaction";

interface GatewayPacketProps {
  transaction: InboxTransactionItem;
  currentStageId: string | null;
  status: "running" | "success" | "failure";
}

export const GatewayPacket: React.FC<GatewayPacketProps> = ({
  transaction,
  currentStageId,
  status,
}) => {
  const isFailed = status === "failure";
  const isComplete = status === "success" && currentStageId === "execution-gate";

  return (
    <div
      className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-4 font-mono text-xs transition-all duration-300 shadow-lg backdrop-blur-md relative overflow-hidden ${
        isFailed
          ? "border-rose-500/80 bg-rose-500/15 text-rose-700 dark:text-rose-300 shadow-rose-500/20 ring-2 ring-rose-500/40"
          : isComplete
          ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-emerald-500/20"
          : "border-sky-500/60 bg-sky-500/10 text-sky-800 dark:text-sky-200 shadow-sky-500/15"
      }`}
    >
      {/* Visual pulse trail */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isFailed ? "bg-rose-500" : isComplete ? "bg-emerald-500" : "bg-sky-500 animate-pulse"
        }`}
      />

      <div className="flex items-center gap-3">
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
            isFailed
              ? "bg-rose-500/20 text-rose-500"
              : isComplete
              ? "bg-emerald-500/20 text-emerald-500"
              : "bg-sky-500/20 text-sky-500 animate-spin"
          }`}
        >
          {isFailed ? (
            <AlertOctagon className="w-4 h-4" />
          ) : isComplete ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black tracking-tight text-heading text-xs sm:text-sm">
              PACKET: {transaction.requestId}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                isFailed
                  ? "bg-rose-500/20 border-rose-500/30 text-rose-500"
                  : isComplete
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500"
                  : "bg-sky-500/20 border-sky-500/30 text-sky-500"
              }`}
            >
              {isFailed ? "TRANSIT HALTED" : isComplete ? "AUTHORIZED" : "IN TRANSIT"}
            </span>
          </div>

          <span className="text-[11px] text-caption font-sans font-medium">
            {transaction.transaction.sender} → {transaction.transaction.receiver} ({transaction.transaction.formattedAmount})
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-3 text-[11px] text-caption font-mono">
        <span>SESSION: {transaction.securityContext.sessionId}</span>
        <span>NONCE: {transaction.securityContext.nonce}</span>
      </div>
    </div>
  );
};
