import React from "react";
import { motion } from "motion/react";
import { Layers, ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import type { SignedTransactionPacket } from "../../../types/transaction";
import type { GatewayTraceEvent } from "../../../types/gatewayTrace";

interface CanonicalizationAnimationProps {
  packet: SignedTransactionPacket;
  event: GatewayTraceEvent | null;
}

export const CanonicalizationAnimation: React.FC<CanonicalizationAnimationProps> = ({
  packet,
  event: _event,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-3">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-semibold"
      >
        <Layers className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
        <span>STAGE 3/8: RFC 8785 JSON CANONICALIZATION SCHEME (JCS)</span>
      </motion.div>

      {/* Main Canonicalization Workflow */}
      <div className="w-full max-w-3xl flex flex-col gap-3 font-mono text-xs">
        {/* Step 1: Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Unordered Raw Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl border bg-slate-950/70 border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="font-bold text-slate-300">UNORDERED RAW INGRESS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold">
                ARBITRARY KEY ORDER
              </span>
            </div>
            <pre className="p-2.5 my-2 rounded-xl bg-slate-900/90 text-amber-300/90 text-[11px] leading-relaxed border border-slate-800/80 overflow-x-auto">
{`{
  "receiver": "${packet.payload.receiver}",
  "nonce": "${packet.payload.nonce}",
  "sender": "${packet.payload.sender}",
  "sessionId": "${packet.payload.sessionId}",
  "sequence": ${packet.payload.sequence}
}`}
            </pre>
            <span className="text-[10px] text-slate-500">Whitespace & key-order nondeterministic</span>
          </motion.div>

          {/* Canonical Sorted Stream */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3.5 rounded-2xl border bg-slate-900/90 border-indigo-500/30 flex flex-col justify-between shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
              <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                RFC 8785 CANONICAL CONTEXT
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-2.5 h-2.5" />
                LEXICOGRAPHICALLY SORTED
              </span>
            </div>
            <pre className="p-2.5 my-2 rounded-xl bg-slate-950 text-emerald-400 text-[11px] leading-relaxed border border-indigo-500/20 overflow-x-auto">
              {packet.canonicalJson}
            </pre>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Canonical Length: {packet.canonicalJson.length} bytes</span>
              <span className="text-emerald-400 font-bold">ZERO WHITESPACE</span>
            </div>
          </motion.div>
        </div>

        {/* Normalization Invariants Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-300"
        >
          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong className="text-slate-100">Deterministic Invariant:</strong> Same context yields identical byte stream across all distributed nodes.
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 flex-shrink-0">
            <span>READY FOR SHA-256 DIGEST</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
