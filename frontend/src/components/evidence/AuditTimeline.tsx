import React, { useState } from "react";
import { FileText, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const AuditTimeline: React.FC = () => {
  const { auditEvents } = useSecurityStore();
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  return (
    <div
      className="rounded-2xl border p-4 sm:p-5 shadow-sm transition-all"
      style={{
        backgroundColor: "rgb(var(--surface))",
        borderColor: "rgb(var(--border))",
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: "rgb(var(--border))" }}>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>REAL-TIME AUDIT & EVIDENCE LOG</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {auditEvents.length} Events Logged
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable chronological record of gateway verification checkpoints and policy enforcement.
          </p>
        </div>
      </div>

      {auditEvents.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p>No transactions evaluated yet. Dispatch a transaction from Console or run an Attack Lab scenario.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {auditEvents.map((evt) => {
            const isExpanded = expandedEventId === evt.id;
            const isAccepted = evt.status === "accepted";
            const isHeroReplay = evt.authenticity === "valid" && evt.execution === "blocked";

            return (
              <div
                key={evt.id}
                className="rounded-xl border transition-all"
                style={{
                  backgroundColor: "rgb(var(--surface-muted))",
                  borderColor: isHeroReplay
                    ? "rgb(var(--warning) / 0.4)"
                    : isAccepted
                    ? "rgb(var(--success) / 0.4)"
                    : "rgb(var(--danger) / 0.4)",
                }}
              >
                <div
                  onClick={() => toggleExpand(evt.id)}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    {isAccepted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {evt.transactionId}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            isAccepted
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : isHeroReplay
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {evt.execution === "authorized" ? "AUTHORIZED" : `BLOCKED (${evt.ruleViolated})`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[280px] sm:max-w-xl">
                        {evt.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400 font-mono">
                    <span>{evt.timestamp}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {/* Expanded Inspection Drawer */}
                {isExpanded && (
                  <div className="p-3.5 pt-0 border-t mt-1 text-xs" style={{ borderColor: "rgb(var(--border))" }}>
                    <div className="my-2 p-2.5 rounded-lg bg-white dark:bg-slate-900 border text-[11px] font-mono space-y-1">
                      <div><strong className="text-slate-400">Signer:</strong> {evt.packet.payload.sender} $\to$ {evt.packet.payload.receiver}</div>
                      <div><strong className="text-slate-400">Nonce:</strong> {evt.packet.payload.nonce}</div>
                      <div><strong className="text-slate-400">Sequence:</strong> {evt.packet.payload.sequence}</div>
                      <div><strong className="text-slate-400">ML-DSA Signature:</strong> {evt.packet.signatureHex.slice(0, 32)}...</div>
                      <div><strong className="text-slate-400">Decision Latency:</strong> {evt.decision.simulationLatencyMs} ms</div>
                    </div>

                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b text-slate-400" style={{ borderColor: "rgb(var(--border))" }}>
                            <th className="py-1 px-1.5">Checkpoint</th>
                            <th className="py-1 px-1.5">Observed</th>
                            <th className="py-1 px-1.5">Expected</th>
                            <th className="py-1 px-1.5">Verdict</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
                          {evt.decision.evidence.map((item) => (
                            <tr key={item.id}>
                              <td className="py-1.5 px-1.5 font-semibold text-slate-700 dark:text-slate-300">{item.label}</td>
                              <td className="py-1.5 px-1.5 font-mono text-slate-600 dark:text-slate-400">{item.observed}</td>
                              <td className="py-1.5 px-1.5 font-mono text-slate-600 dark:text-slate-400">{item.expected}</td>
                              <td className="py-1.5 px-1.5">
                                <span className={`font-bold ${item.status === "pass" ? "text-emerald-600" : "text-rose-600"}`}>
                                  {item.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
