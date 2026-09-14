import React from "react";
import { CheckCircle2, XCircle, ShieldAlert, Sparkles } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const BeforeAfterDiff: React.FC = () => {
  const { baselineAuthorizedPacket } = useSecurityStore();

  const baseline = baselineAuthorizedPacket ?? {
    id: "TX-104",
    payload: {
      message: "Transfer ₹10,000 to Bob",
      sender: "Alice",
      receiver: "Bob",
      sessionId: "S-4821",
      nonce: "N-88321",
      sequence: 104,
      issuedAt: "14:41:00 UTC",
      expiresAt: "14:56:00 UTC",
    },
    signatureHex: "sig_mldsa65_4f92d8...pqauth",
  };

  return (
    <div
      className="rounded-2xl border p-4 sm:p-5 shadow-sm transition-all card-panel"
    >
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-heading flex items-center gap-2">
              <span>BEFORE / AFTER EXPLORATION: REPLAY ANATOMY</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold">
                KEY LESSON
              </span>
            </h3>
            <p className="text-xs text-caption">
              Comparing original execution vs. identical replayed packet.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-semibold text-caption">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Same Cryptographic Signature</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
        {/* Card 1: Initial Legitimate Execution */}
        <div
          className="rounded-xl border p-4 flex flex-col justify-between"
          style={{
            backgroundColor: "rgb(var(--surface-muted))",
            borderColor: "rgba(var(--success), 0.4)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>1st Request (Legitimate Origin)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">
                AUTHORIZED ✓
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-body font-mono-tabular mt-3">
              <div className="flex justify-between py-1 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                <span className="text-caption">Transaction</span>
                <span className="font-bold text-heading">{baseline.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                <span className="text-caption">ML-DSA Signature</span>
                <span className="text-emerald-500 font-bold">VALID ✓</span>
              </div>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                <span className="text-caption">Nonce State</span>
                <span className="text-emerald-500 font-bold">{baseline.payload.nonce} (FRESH)</span>
              </div>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                <span className="text-caption">Sequence</span>
                <span className="text-emerald-500 font-bold">{baseline.payload.sequence} (VALID)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-caption font-medium border-t" style={{ borderColor: "rgb(var(--border))" }}>
            Gateway verification passed all guards. Nonce committed to replay store.
          </div>
        </div>

        {/* Card 2: Replay Execution */}
        <div
          className="rounded-xl border p-4 flex flex-col justify-between"
          style={{
            backgroundColor: "rgb(var(--surface-muted))",
            borderColor: "rgba(var(--danger), 0.4)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-rose-500 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" />
                <span>2nd Request (Replay Attack)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 font-bold">
                BLOCKED ✕
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-body font-mono-tabular mt-3">
              <div className="flex justify-between py-1 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                <span className="text-caption">Transaction</span>
                <span className="font-bold text-heading">{baseline.id} (REUSED)</span>
              </div>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                <span className="text-caption">ML-DSA Signature</span>
                <span className="text-emerald-500 font-bold">STILL VALID ✓</span>
              </div>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                <span className="text-caption">Nonce State</span>
                <span className="text-rose-500 font-bold">{baseline.payload.nonce} (ALREADY CONSUMED ✕)</span>
              </div>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                <span className="text-caption">Sequence</span>
                <span className="text-rose-500 font-bold">{baseline.payload.sequence} (REPEATED ✕)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-rose-500 font-semibold border-t" style={{ borderColor: "rgb(var(--border))" }}>
            Signature is 100% genuine. Gateway prevented duplicate execution.
          </div>
        </div>
      </div>

      <div
        className="mt-3.5 p-3 rounded-xl border text-center text-xs font-semibold"
        style={{
          backgroundColor: "rgb(var(--surface-muted))",
          borderColor: "rgb(var(--border))",
        }}
      >
        <span className="text-caption">Takeaway: </span>
        <span className="text-heading">
          "The signature was never cracked. The attack was the reuse of valid authorization. Q-SignGuard separates Authenticity from Execution Validity."
        </span>
      </div>
    </div>
  );
};
