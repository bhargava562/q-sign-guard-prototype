import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const IncomingRequestCard: React.FC = () => {
  const {
    incomingRequests,
    selectedIncomingRequest,
    selectIncomingRequest,
    verifyAndProcess,
    isProcessing,
  } = useSecurityStore();

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">
      {/* Top Request Queue Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-caption">
            Gateway Ingestion Queue
          </span>
          <h2 className="text-lg font-black text-heading">Incoming Transaction Request</h2>
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-xl border bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
          {incomingRequests.map((req) => {
            const isSelected = req.id === selectedIncomingRequest.id;
            return (
              <button
                key={req.id}
                type="button"
                onClick={() => selectIncomingRequest(req)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-caption hover:text-heading"
                }`}
              >
                {req.requestId}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Spatial Transaction Card */}
      <div className="relative rounded-3xl border p-6 sm:p-8 shadow-sm transition-all card-panel overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Request Metadata Tag */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-heading font-semibold">
              REQUEST ID: {selectedIncomingRequest.requestId}
            </span>
            <span className="text-caption text-xs">•</span>
            <span className="text-xs font-mono text-caption">
              Source: {selectedIncomingRequest.source}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Awaiting Gateway Verification
          </span>
        </div>

        {/* Spatial Transfer Visual: Alice ── ₹10,000 ──> Bob */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
          {/* Sender */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-caption font-semibold">
              Origin (Signer)
            </span>
            <span className="text-xl sm:text-2xl font-black text-heading mt-1">
              {selectedIncomingRequest.sender}
            </span>
            <span className="text-xs font-mono text-caption mt-0.5">Authorized Account</span>
          </div>

          {/* Transfer Conduit & Amount */}
          <div className="flex flex-col items-center justify-center flex-1 max-w-xs px-4">
            <span className="text-xl sm:text-3xl font-black text-heading tracking-tight mb-2 text-indigo-600 dark:text-indigo-400">
              {selectedIncomingRequest.amount}
            </span>
            <div className="w-full flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500 rounded" />
              <ArrowRight className="h-4 w-4 text-indigo-500" />
            </div>
            <span className="text-[11px] font-mono text-caption mt-2 truncate max-w-[200px]">
              {selectedIncomingRequest.message}
            </span>
          </div>

          {/* Receiver */}
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
            <span className="text-xs font-mono uppercase tracking-wider text-caption font-semibold">
              Destination
            </span>
            <span className="text-xl sm:text-2xl font-black text-heading mt-1">
              {selectedIncomingRequest.receiver}
            </span>
            <span className="text-xs font-mono text-caption mt-0.5">Target Enclave</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-caption font-medium text-center sm:text-left">
            <span>Every request is checked for: </span>
            <span className="font-semibold text-heading">Authenticity → Context → Freshness → Gate</span>
          </div>
          <button
            type="button"
            onClick={verifyAndProcess}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-white shadow-lg transition-all flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Verify & Process</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
