import React from "react";
import { motion } from "motion/react";
import { Binary, ArrowRight, CheckCircle2, User, KeyRound, Hash, Calendar } from "lucide-react";
import type { SignedTransactionPacket } from "../../../types/transaction";
import type { GatewayTraceEvent } from "../../../types/gatewayTrace";

interface PayloadParsingAnimationProps {
  packet: SignedTransactionPacket;
  event: GatewayTraceEvent | null;
}

export const PayloadParsingAnimation: React.FC<PayloadParsingAnimationProps> = ({
  packet,
  event: _event,
}) => {
  const fields = [
    { label: "sender", value: packet.payload.sender, icon: User, color: "text-sky-400" },
    { label: "receiver", value: packet.payload.receiver, icon: User, color: "text-sky-400" },
    { label: "amount", value: `${packet.payload.message.includes("₹") ? "" : ""}${packet.payload.message}`, icon: Hash, color: "text-emerald-400" },
    { label: "sessionId", value: packet.payload.sessionId, icon: KeyRound, color: "text-indigo-400" },
    { label: "nonce", value: packet.payload.nonce, icon: KeyRound, color: "text-amber-400" },
    { label: "sequence", value: String(packet.payload.sequence), icon: Hash, color: "text-purple-400" },
    { label: "issuedAt", value: packet.payload.issuedAt.slice(11, 19) + " UTC", icon: Calendar, color: "text-slate-400" },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-3">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold"
      >
        <Binary className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
        <span>STAGE 2/8: PAYLOAD DECODING & NORMALIZATION</span>
      </motion.div>

      {/* Main Split Visualization */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Raw Ingress Stream */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border p-4 bg-slate-950/80 border-slate-800 flex flex-col justify-between font-mono text-xs shadow-xl"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <span className="font-bold flex items-center gap-1.5 text-slate-300">
              <Binary className="w-3.5 h-3.5 text-cyan-400" />
              RAW INGRESS JSON
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400">
              BYTE STREAM
            </span>
          </div>

          <pre className="p-3 my-2 rounded-xl bg-slate-900 text-slate-300 text-[11px] leading-relaxed overflow-x-auto border border-slate-800/80">
            {JSON.stringify(
              {
                sender: packet.payload.sender,
                receiver: packet.payload.receiver,
                amount: packet.payload.message,
                sessionId: packet.payload.sessionId,
                nonce: packet.payload.nonce,
                sequence: packet.payload.sequence,
              },
              null,
              2
            )}
          </pre>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Encoding: UTF-8 / JSON</span>
            <span className="text-cyan-400 font-bold">PARSED OK</span>
          </div>
        </motion.div>

        {/* Right: Structured Protocol Field Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border p-4 bg-slate-900/90 border-cyan-500/20 flex flex-col justify-between font-mono text-xs shadow-xl"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              EXTRACTED SECURITY FIELDS
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">7 / 7 VALID</span>
          </div>

          <div className="space-y-1.5 my-2">
            {fields.map((field, idx) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60"
                >
                  <div className="flex items-center gap-2 text-slate-400">
                    <Icon className={`w-3 h-3 ${field.color}`} />
                    <span className="text-[11px]">{field.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                    <span className={`text-[11px] font-bold ${field.color}`}>{field.value}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Session Anchor: {packet.payload.sessionId}</span>
            <span className="text-emerald-400 font-bold">READY FOR JCS</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
