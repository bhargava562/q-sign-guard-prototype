import React from "react";
import { motion } from "motion/react";
import { UserCheck, ShieldCheck, ArrowRight, ShieldAlert } from "lucide-react";
import type { SignedTransactionPacket } from "../../../types/transaction";
import type { GatewayTraceEvent } from "../../../types/gatewayTrace";

interface ContextBindingAnimationProps {
  packet: SignedTransactionPacket;
  event: GatewayTraceEvent | null;
}

export const ContextBindingAnimation: React.FC<ContextBindingAnimationProps> = ({
  packet,
  event,
}) => {
  const isSuccess = event?.status !== "failure";

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-3">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 mb-4 px-3 py-1 rounded-full border text-xs font-mono font-semibold ${
          isSuccess
            ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}
      >
        <UserCheck className="w-3.5 h-3.5 animate-pulse" />
        <span>STAGE 6/8: IDENTITY BINDING & SESSION CONTEXT RESOLUTION</span>
      </motion.div>

      <div className="w-full max-w-3xl flex flex-col gap-4 font-mono text-xs">
        {/* Context Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Node 1: Identity & Signer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl border bg-slate-900/90 border-slate-800 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                IDENTITY BINDING
              </span>
              <div className="mt-2">
                <span className="text-slate-100 font-bold text-sm block">
                  {packet.payload.sender}
                </span>
                <span className="text-[10px] text-slate-500">Authorized Signer</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">CERT STATUS:</span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
          </motion.div>

          {/* Node 2: Session Envelope */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3.5 rounded-2xl border bg-slate-900/90 border-slate-800 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                SESSION ANCHOR
              </span>
              <div className="mt-2">
                <span className="text-indigo-400 font-bold text-sm block">
                  {packet.payload.sessionId}
                </span>
                <span className="text-[10px] text-slate-500">mTLS State Tunnel</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">POLICY:</span>
              <span className={isSuccess ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                {isSuccess ? "AUTHORIZED" : "POLICY VIOLATION"}
              </span>
            </div>
          </motion.div>

          {/* Node 3: Routing Counterparty */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3.5 rounded-2xl border bg-slate-900/90 border-slate-800 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                BENEFICIARY ROUTING
              </span>
              <div className="mt-2">
                <span className="text-slate-100 font-bold text-sm block">
                  {packet.payload.receiver}
                </span>
                <span className="text-[10px] text-slate-500">Settlement Target</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">ROUTING:</span>
              <span className="text-emerald-400 font-bold">PERMITTED</span>
            </div>
          </motion.div>
        </div>

        {/* Verification Summary Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isSuccess
              ? "bg-slate-950/80 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/40 border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {isSuccess ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold block text-slate-100 text-xs">
                {isSuccess
                  ? `Context Guard: Session '${packet.payload.sessionId}' is ACTIVE & AUTHORIZED`
                  : "Context Authorization Violation: Session or routing denied"}
              </span>
              <span className="text-[10px] text-slate-400">
                Identity verified and counterparty routing within authorized policy boundaries.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20 flex-shrink-0">
            <span>NEXT: REPLAY PROTECTION STORE</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
