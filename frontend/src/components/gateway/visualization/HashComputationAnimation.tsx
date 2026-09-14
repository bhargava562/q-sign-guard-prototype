import React from "react";
import { motion } from "motion/react";
import { Hash, Cpu, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import type { SignedTransactionPacket } from "../../../types/transaction";
import type { GatewayTraceEvent } from "../../../types/gatewayTrace";

interface HashComputationAnimationProps {
  packet: SignedTransactionPacket;
  event: GatewayTraceEvent | null;
}

export const HashComputationAnimation: React.FC<HashComputationAnimationProps> = ({
  packet,
  event: _event,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-3">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold"
      >
        <Hash className="w-3.5 h-3.5 animate-pulse text-blue-400" />
        <span>STAGE 4/8: SHA-256 CONTEXT COMMITMENT DIGEST ENGINE</span>
      </motion.div>

      <div className="w-full max-w-3xl flex flex-col gap-4 font-mono text-xs">
        {/* Main Hash Engine Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
          {/* 1. Canonical Byte Stream Input */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3.5 rounded-2xl border bg-slate-950/80 border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">CANONICAL BYTES</span>
                <span className="text-[10px] text-blue-400 font-bold">{packet.canonicalJson.length}B</span>
              </div>
              <p className="text-[10px] text-slate-500 my-2 leading-relaxed">
                Raw UTF-8 bytes serialized under RFC 8785:
              </p>
              <div className="p-2 rounded-lg bg-slate-900 text-slate-400 text-[10px] font-mono break-all leading-tight max-h-24 overflow-hidden border border-slate-800">
                {Array.from(packet.canonicalJson.slice(0, 72))
                  .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
                  .join(" ")}
                ...
              </div>
            </div>
            <span className="text-[10px] text-blue-400/80 mt-2">512-bit message block feeding</span>
          </motion.div>

          {/* 2. SHA-256 Hardware Compression Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-2xl border bg-slate-900/90 border-blue-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl"
          >
            <div className="p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 mb-2">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-bold text-slate-100 text-sm">SHA-256 Core</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">64-round compression</p>

            {/* Active processing visual pulse */}
            <div className="w-full flex items-center justify-center gap-1 my-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [6, 18, 6], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
                  className="w-1.5 rounded-full bg-blue-400"
                />
              ))}
            </div>

            <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              HASHING COMPLETE
            </span>
          </motion.div>

          {/* 3. Resulting 256-bit Digest */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3.5 rounded-2xl border bg-slate-950/80 border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  CONTEXT DIGEST
                </span>
                <span className="text-[10px] text-slate-400 font-bold">256-BIT</span>
              </div>
              <p className="text-[10px] text-slate-500 my-2">Cryptographic commitment digest:</p>
              <div className="p-2.5 rounded-lg bg-slate-900 text-sky-400 text-[11px] font-mono break-all leading-tight border border-blue-500/20 font-bold">
                {packet.contextHashHex}
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-2">
              <CheckCircle2 className="w-3 h-3" />
              <span>Immutable cryptographic anchor</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-2.5 px-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-slate-400 text-[11px]"
        >
          <span>This digest binds all 8 context fields to the post-quantum signature verification guard.</span>
          <span className="text-blue-400 font-bold flex items-center gap-1">
            <span>READY FOR ML-DSA-65</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </motion.div>
      </div>
    </div>
  );
};
