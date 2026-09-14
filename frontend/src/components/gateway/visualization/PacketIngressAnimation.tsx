import React from "react";
import { motion } from "motion/react";
import { Inbox, Shield, ArrowDown, Cpu, FileCheck, Radio } from "lucide-react";
import type { SignedTransactionPacket } from "../../../types/transaction";
import type { GatewayTraceEvent } from "../../../types/gatewayTrace";

interface PacketIngressAnimationProps {
  packet: SignedTransactionPacket;
  event: GatewayTraceEvent | null;
}

export const PacketIngressAnimation: React.FC<PacketIngressAnimationProps> = ({
  packet,
  event: _event,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold"
      >
        <Radio className="w-3.5 h-3.5 animate-pulse text-sky-400" />
        <span>STAGE 1/8: INBOUND INGRESS BUFFER ACQUISITION</span>
      </motion.div>

      {/* Main Ingress Capsule */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl rounded-2xl border p-5 sm:p-6 relative overflow-hidden bg-slate-900/90 border-sky-500/30 shadow-2xl backdrop-blur-md"
      >
        {/* Ambient background glow & scanline */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-transparent pointer-events-none" />
        <motion.div
          className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent pointer-events-none"
          animate={{ y: [0, 180, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                  Ingress Packet
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 font-bold">
                  {packet.id}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                {packet.payload.sender} → {packet.payload.receiver}
              </h3>
            </div>
          </div>

          <div className="flex flex-col sm:items-end font-mono text-xs">
            <span className="text-slate-400 text-[11px]">TRANSACTION INTENT</span>
            <span className="text-emerald-400 font-black text-base sm:text-lg">
              {packet.payload.message || `Transfer to ${packet.payload.receiver}`}
            </span>
          </div>
        </div>

        {/* Ingress Structure Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Security Envelope</span>
            </span>
            <span className="text-slate-200 font-bold">8 Protocol Fields</span>
            <span className="text-[10px] text-slate-500">Session, Nonce, Sequence</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Post-Quantum Signature</span>
            </span>
            <span className="text-indigo-300 font-bold">{packet.algorithm}</span>
            <span className="text-[10px] text-slate-500">NIST FIPS 204 Attached</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enclave Security</span>
            </span>
            <span className="text-emerald-400 font-bold">mTLS Ingress Active</span>
            <span className="text-[10px] text-slate-500">TLS 1.3 Verified Tunnel</span>
          </div>
        </div>

        {/* Downward transit arrow */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-xs font-mono text-sky-400"
        >
          <span>Ingress packet verified · Transiting to payload parser</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </motion.div>
      </motion.div>
    </div>
  );
};
