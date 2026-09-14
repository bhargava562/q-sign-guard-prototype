import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Lock, Unlock } from "lucide-react";
import type { SignedTransactionPacket } from "../../../types/transaction";
import type { GatewayTraceEvent } from "../../../types/gatewayTrace";

interface ExecutionGateAnimationProps {
  packet: SignedTransactionPacket;
  event: GatewayTraceEvent | null;
}

export const ExecutionGateAnimation: React.FC<ExecutionGateAnimationProps> = ({
  packet,
  event,
}) => {
  const isAccepted = event?.status !== "failure";
  const isReplay = packet.fixtureCondition === "replay";
  const isTampered = packet.fixtureCondition === "tampered";

  const invariants = [
    {
      name: "Authenticity Guard (ML-DSA-65)",
      status: !isTampered,
      detail: !isTampered ? "Authentic NIST FIPS 204 signature" : "Signature mismatch",
    },
    {
      name: "Context Guard (Session & Identity)",
      status: packet.fixtureCondition !== "contextViolation",
      detail: packet.fixtureCondition !== "contextViolation" ? "Session S-4821 valid" : "Context unauthorized",
    },
    {
      name: "Freshness Guard (Replay Nonce)",
      status: !isReplay,
      detail: !isReplay ? `Nonce ${packet.payload.nonce} novel` : `Nonce ${packet.payload.nonce} reused`,
    },
    {
      name: "Sequence Guard (Monotonic Counter)",
      status: packet.fixtureCondition !== "sequenceViolation",
      detail: packet.fixtureCondition !== "sequenceViolation" ? `Seq ${packet.payload.sequence} monotonic` : "Sequence gap detected",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-3">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 mb-4 px-3 py-1 rounded-full border text-xs font-mono font-semibold ${
          isAccepted
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}
      >
        {isAccepted ? (
          <Unlock className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
        ) : (
          <Lock className="w-3.5 h-3.5 animate-pulse text-red-400" />
        )}
        <span>STAGE 8/8: SETTLEMENT EXECUTION GATE</span>
      </motion.div>

      <div className="w-full max-w-3xl flex flex-col gap-4 font-mono text-xs">
        {/* Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: 4 Security Invariants Checklist */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-2xl border bg-slate-950/80 border-slate-800 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                <span className="font-bold text-slate-200">GATE INVARIANTS MATRIX</span>
                <span className="text-[10px] text-slate-400">4 MANDATORY POLICIES</span>
              </div>

              <div className="space-y-2 mt-3">
                {invariants.map((inv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      {inv.status ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-slate-200 block">
                          {inv.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{inv.detail}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        inv.status ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {inv.status ? "PASS" : "FAIL"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <span className="text-[10px] text-slate-500 mt-2">
              All 4 invariants must simultaneously hold to authorize core settlement.
            </span>
          </motion.div>

          {/* Right: Enclave Gate Mechanical Visual */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xl ${
              isAccepted
                ? "bg-slate-900/90 border-emerald-500/40"
                : "bg-red-950/40 border-red-500/50"
            }`}
          >
            {/* Gate Icon / Blast Door Graphic */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`p-4 rounded-3xl border mb-3 ${
                isAccepted
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/20"
                  : "bg-red-500/20 border-red-500/50 text-red-400 shadow-lg shadow-red-500/20"
              }`}
            >
              {isAccepted ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
            </motion.div>

            <h3 className="text-base sm:text-lg font-black text-slate-100">
              {isAccepted ? "SETTLEMENT AUTHORIZED" : "EXECUTION BLOCKED"}
            </h3>

            <p className="text-xs text-slate-400 my-2 max-w-xs leading-relaxed">
              {isAccepted
                ? `Disbursing ${packet.payload.message} from ${packet.payload.sender} to ${packet.payload.receiver}.`
                : "Security invariants failed. Transaction blocked prior to ledger settlement."}
            </p>

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                isAccepted
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}
            >
              {isAccepted ? "GATE UNLOCKED · DISPATCHING RECEIPT" : "GATE LOCKED · REJECTION ENFORCED"}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
