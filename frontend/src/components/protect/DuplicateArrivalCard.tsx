import React from "react";
import { ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const DuplicateArrivalCard: React.FC = () => {
  const { baselineAuthorizedPacket, processDuplicate, isProcessing, resetToIncoming } = useSecurityStore();

  if (!baselineAuthorizedPacket) return null;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 py-2">
      {/* Banner indicating duplicate incoming packet */}
      <div className="rounded-2xl border p-4 flex items-center justify-between border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div className="text-xs font-medium">
            <span className="font-bold">INCOMING REPLAY DETECTED: </span>
            <span>A request identical in payload, session, and signature has entered the gateway pipeline.</span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-amber-500/20">
          Identical Packet
        </span>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border p-6 sm:p-8 shadow-sm card-panel border-amber-500/30">
        {/* Request Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-sm font-black tracking-wide uppercase text-heading">
              Duplicate Request Arrived: {baselineAuthorizedPacket.id}
            </h3>
          </div>
          <span className="text-xs font-mono text-caption">Awaiting Operator Verification</span>
        </div>

        {/* Spatial Transfer Details */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
          <div className="text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-caption font-semibold">Origin</span>
            <div className="text-xl sm:text-2xl font-black text-heading mt-1">
              {baselineAuthorizedPacket.payload.sender}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 max-w-xs px-4">
            <span className="text-xl sm:text-2xl font-black text-heading tracking-tight mb-2 text-amber-600 dark:text-amber-400">
              {baselineAuthorizedPacket.payload.message}
            </span>
            <div className="w-full flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500 to-rose-500 rounded" />
              <ArrowRight className="h-4 w-4 text-rose-500" />
            </div>
            <span className="text-[11px] font-mono text-caption mt-2">
              Signature: Valid ML-DSA-65 Attached
            </span>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-xs font-mono uppercase tracking-wider text-caption font-semibold">Destination</span>
            <div className="text-xl sm:text-2xl font-black text-heading mt-1">
              {baselineAuthorizedPacket.payload.receiver}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={resetToIncoming}
            className="text-xs font-semibold text-caption hover:text-heading"
          >
            Cancel & Return to Queue
          </button>
          <button
            type="button"
            onClick={processDuplicate}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-white shadow-lg transition-all flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 active:scale-[0.98] disabled:opacity-50"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Process Duplicate Request</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
