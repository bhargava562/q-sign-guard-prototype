import React from "react";
import { motion } from "motion/react";
import { Database, CheckCircle2, AlertTriangle, KeyRound } from "lucide-react";
import type { SignedTransactionPacket } from "../../../types/transaction";
import type { GatewayTraceEvent } from "../../../types/gatewayTrace";

interface ReplayStoreAnimationProps {
  packet: SignedTransactionPacket;
  event: GatewayTraceEvent | null;
}

export const ReplayStoreAnimation: React.FC<ReplayStoreAnimationProps> = ({
  packet,
  event,
}) => {
  const isSuccess = event?.status !== "failure";
  const isReplay = packet.fixtureCondition === "replay" || !isSuccess;

  // Sample database rows showing stateful memory
  const storeRows = [
    { session: "S-9901", nonce: "N-91204", seq: 501, status: "CONSUMED", color: "text-slate-400" },
    { session: "S-4821", nonce: "N-44219", seq: 103, status: "CONSUMED", color: "text-slate-400" },
    {
      session: packet.payload.sessionId,
      nonce: packet.payload.nonce,
      seq: packet.payload.sequence,
      status: isReplay ? "HIT: ALREADY CONSUMED" : "UNCONSUMED (FRESH)",
      color: isReplay ? "text-red-400 bg-red-500/20 font-black" : "text-emerald-400 bg-emerald-500/20 font-bold",
      isTarget: true,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-3">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 mb-4 px-3 py-1 rounded-full border text-xs font-mono font-semibold ${
          isSuccess
            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}
      >
        <Database className="w-3.5 h-3.5 animate-pulse" />
        <span>STAGE 7/8: STATEFUL REPLAY PROTECTION STORE QUERY</span>
      </motion.div>

      <div className="w-full max-w-3xl flex flex-col gap-4 font-mono text-xs">
        {/* Replay Protection Registry Table */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border p-4 bg-slate-950/90 border-slate-800 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px]">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              NONCE & SEQUENCE REGISTRY (IN-MEMORY ENCLAVE LEDGER)
            </span>
            <span className="text-[10px] text-slate-400">SESSION: {packet.payload.sessionId}</span>
          </div>

          {/* Table */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-500 text-[10px]">
                  <th className="pb-2 font-semibold">SESSION</th>
                  <th className="pb-2 font-semibold">NONCE</th>
                  <th className="pb-2 font-semibold">SEQUENCE</th>
                  <th className="pb-2 font-semibold">LOOKUP STATE</th>
                  <th className="pb-2 font-semibold text-right">GATE ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {storeRows.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={row.isTarget ? { backgroundColor: "rgba(239, 68, 68, 0.1)" } : {}}
                    animate={
                      row.isTarget
                        ? isReplay
                          ? { backgroundColor: ["rgba(239, 68, 68, 0.15)", "rgba(239, 68, 68, 0.3)", "rgba(239, 68, 68, 0.15)"] }
                          : { backgroundColor: "rgba(16, 185, 129, 0.1)" }
                        : {}
                    }
                    transition={row.isTarget ? { repeat: Infinity, duration: 1.5 } : {}}
                    className={row.isTarget ? "border-y border-amber-500/40" : ""}
                  >
                    <td className="py-2.5 text-slate-300 font-bold">{row.session}</td>
                    <td className="py-2.5 font-mono text-slate-200 flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-amber-400" />
                      {row.nonce}
                    </td>
                    <td className="py-2.5 text-slate-400">{row.seq}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      {row.isTarget ? (
                        isReplay ? (
                          <span className="text-red-400 font-black text-[10px] uppercase">
                            DEFLECT REPLAY
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold text-[10px] uppercase">
                            ALLOW COMMIT
                          </span>
                        )
                      ) : (
                        <span className="text-slate-600 text-[10px]">LOCKED</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Query: HashIndex(S-4821:N-88321)</span>
            <span className="text-slate-400 font-bold">
              {isReplay ? "LOOKUP TIME: 0.18ms · COLLISION DETECTED" : "LOOKUP TIME: 0.12ms · UNIQUE NONCE"}
            </span>
          </div>
        </motion.div>

        {/* KILLER MOMENT HERO CALLOUT BANNER */}
        {isReplay ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl border bg-red-950/70 border-red-500/50 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex-shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500 text-white tracking-widest">
                    SECURITY INVARIANT VIOLATION
                  </span>
                  <span className="text-red-400 text-xs font-bold">RULE: REPLAY_NONCE_REUSED</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white tracking-tight pt-1">
                  THE SIGNATURE IS VALID. THE EXECUTION IS NOT.
                </h4>
                <p className="text-xs text-red-200/90 leading-relaxed">
                  Nonce <strong className="text-white font-mono">{packet.payload.nonce}</strong> was already consumed in session <strong className="text-white font-mono">{packet.payload.sessionId}</strong>. While ML-DSA-65 confirms authentic origin, this authorization cannot be executed a second time.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3.5 rounded-2xl border bg-emerald-950/40 border-emerald-500/30 flex items-center justify-between text-emerald-300"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-100 text-xs block">
                  FRESHNESS INVARIANT SATISFIED: NONCE IS UNCONSUMED
                </span>
                <span className="text-[10px] text-slate-400">
                  Nonce {packet.payload.nonce} is novel. Monotonic sequence {packet.payload.sequence} is consecutive.
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">
              GATE UNLOCK PENDING
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
