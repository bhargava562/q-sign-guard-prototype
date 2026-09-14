import React from "react";
import { CheckCircle2, XCircle, FileText, ArrowRight, Clock } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const ActivityLedger: React.FC = () => {
  const { auditEvents, openEvidenceSheet, setActiveTab } = useSecurityStore();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-caption">
            Gateway Operational Audit Ledger
          </span>
          <h1 className="text-2xl font-black text-heading mt-1">Transaction Activity History</h1>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-caption border border-slate-200 dark:border-slate-700">
          {auditEvents.length} Recorded Events
        </span>
      </div>

      {/* Ledger Table / List */}
      {auditEvents.length === 0 ? (
        <div className="rounded-3xl border p-12 text-center card-panel border-dashed">
          <Clock className="h-10 w-10 text-caption mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-heading">No Transactions Processed Yet</h3>
          <p className="text-xs text-caption mt-1 max-w-md mx-auto">
            Transactions processed through the gateway will automatically appear here with full cryptographic audit evidence.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("protect")}
            className="mt-5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>Process a Transaction in Protect</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {auditEvents.map((evt) => {
            const isAuthorized = evt.execution === "authorized";
            return (
              <div
                key={evt.id}
                className="p-4 sm:p-5 rounded-2xl border transition-all hover:scale-[1.005] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isAuthorized
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                    }`}
                  >
                    {isAuthorized ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-heading">
                        {evt.transactionId}
                      </span>
                      <span className="text-caption text-xs">•</span>
                      <span
                        className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          isAuthorized
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {isAuthorized ? "AUTHORIZED ✓" : `${evt.ruleViolated || "BLOCKED"} ✕`}
                      </span>
                      <span className="text-caption text-xs hidden sm:inline">•</span>
                      <span className="text-xs font-mono text-caption hidden sm:inline">
                        {evt.timestamp}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-heading mt-1">
                      {evt.packet.payload.message}
                    </div>
                    <div className="text-[11px] font-mono text-caption mt-0.5">
                      {evt.packet.payload.sender} ──&gt; {evt.packet.payload.receiver} (Session:{" "}
                      {evt.packet.payload.sessionId})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-mono text-caption mr-2 hidden lg:inline">
                    Latency: {evt.decision.simulationLatencyMs} ms
                  </span>
                  <button
                    type="button"
                    onClick={() => openEvidenceSheet(evt.packet, evt.decision)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-heading hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5 text-indigo-500" />
                    <span>View Evidence</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
