import React from "react";
import { ShieldCheck, ShieldAlert, FileSearch, ArrowRight, Clock } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const SecurityEventsLedger: React.FC = () => {
  const { auditEvents, openEvidenceSheet } = useSecurityStore();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-heading">Security Events</h2>
          <p className="text-xs text-caption font-medium">
            Operational audit log of verified transactions and blocked attempts
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-caption">
          {auditEvents.length} Events Logged
        </span>
      </div>

      {/* Events List */}
      {auditEvents.length === 0 ? (
        <div
          className="p-12 rounded-3xl border text-center flex flex-col items-center gap-3 transition-colors"
          style={{
            backgroundColor: "rgb(var(--surface))",
            borderColor: "rgb(var(--border))",
          }}
        >
          <Clock className="w-8 h-8 text-caption opacity-40" />
          <span className="text-sm font-bold text-heading">No Security Events Yet</span>
          <p className="text-xs text-caption max-w-xs">
            Transactions evaluated by the gateway will record decisions and cryptographic evidence here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {auditEvents.map((evt) => {
            const isAuth = evt.execution === "authorized";
            return (
              <div
                key={evt.id}
                className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-sm"
                style={{
                  backgroundColor: "rgb(var(--surface))",
                  borderColor: "rgb(var(--border))",
                }}
              >
                {/* Left Info */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isAuth
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    }`}
                  >
                    {isAuth ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-caption">{evt.timestamp}</span>
                      <span className="text-xs font-mono font-black text-heading px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/20">
                        {evt.transactionId}
                      </span>
                      <span
                        className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                          isAuth
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {isAuth ? "AUTHORIZED" : evt.ruleViolated === "REPLAY_NONCE_REUSED" ? "REPLAY BLOCKED" : "BLOCKED"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-black text-heading">
                      <span>{evt.packet.payload.sender}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-caption" />
                      <span>{evt.packet.payload.receiver}</span>
                      <span className="text-xs font-mono font-normal text-caption">
                        ({evt.packet.payload.message})
                      </span>
                    </div>

                    <span className="text-xs text-caption font-mono">
                      {evt.reason}
                    </span>
                  </div>
                </div>

                {/* Right Action */}
                <button
                  type="button"
                  onClick={() => openEvidenceSheet(evt.packet, evt.decision)}
                  className="self-end sm:self-center py-2 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 hover:bg-slate-500/5 cursor-pointer"
                  style={{
                    borderColor: "rgb(var(--border))",
                    color: "rgb(var(--text-secondary))",
                  }}
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  <span>VIEW EVIDENCE</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
