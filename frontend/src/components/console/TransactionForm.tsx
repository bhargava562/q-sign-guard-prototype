import React from "react";
import { Send, RotateCcw, Shuffle, Lock, User, ArrowRight, ShieldCheck, Wallet, Landmark, ShoppingBag } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const TransactionForm: React.FC = () => {
  const {
    payload,
    updatePayload,
    randomizeTransaction,
    generateAndSign,
    executePipeline,
    replayBaseline,
    isProcessing,
    baselineAuthorizedPacket,
  } = useSecurityStore();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    const packet = await generateAndSign();
    await executePipeline(packet);
  };

  const presets = [
    {
      id: "p1",
      name: "₹10,000 P2P",
      icon: Wallet,
      message: "Transfer ₹10,000 to Bob",
      sender: "Alice",
      receiver: "Bob",
      sessionId: "S-4821",
    },
    {
      id: "p2",
      name: "250k USDC Vault",
      icon: Landmark,
      message: "Withdrawal: 250,000 USDC",
      sender: "treasury_agent_1",
      receiver: "cold_storage_vault",
      sessionId: "S-9901",
    },
    {
      id: "p3",
      name: "₹45.5k Merchant",
      icon: ShoppingBag,
      message: "Merchant Settlement ₹45,500",
      sender: "hot_wallet_corp",
      receiver: "merchant_gateway",
      sessionId: "S-4821",
    },
  ];

  return (
    <div
      className="flex flex-col rounded-2xl border p-4 sm:p-5 shadow-sm transition-all card-panel"
    >
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-black tracking-wider uppercase text-heading">
            TRANSACTION INTAKE
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                style={{
                  backgroundColor: "rgb(var(--accent-soft))",
                  color: "rgb(var(--accent))",
                }}>
            Signer: {payload.sender}
          </span>
        </div>

        <button
          type="button"
          onClick={randomizeTransaction}
          disabled={isProcessing}
          className="flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border transition-all hover:scale-105"
          style={{
            borderColor: "rgb(var(--border))",
            color: "rgb(var(--text-primary))",
            backgroundColor: "rgb(var(--surface-muted))",
          }}
          title="Generate fresh random Nonce and increment Sequence"
        >
          <Shuffle className="h-3 w-3 text-indigo-400" />
          <span>Randomize</span>
        </button>
      </div>

      {/* Visual Presets Grid */}
      <div className="grid grid-cols-3 gap-2 py-3">
        {presets.map((p) => {
          const Icon = p.icon;
          const isSelected = payload.message === p.message;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() =>
                updatePayload({
                  message: p.message,
                  sender: p.sender,
                  receiver: p.receiver,
                  sessionId: p.sessionId,
                })
              }
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                isSelected
                  ? "border-indigo-500 shadow-sm font-extrabold"
                  : "hover:border-slate-400 dark:hover:border-slate-600 font-medium"
              }`}
              style={{
                backgroundColor: isSelected
                  ? "rgb(var(--accent-soft))"
                  : "rgb(var(--surface-muted))",
                borderColor: isSelected ? "rgb(var(--accent))" : "rgb(var(--border))",
                color: isSelected ? "rgb(var(--accent))" : "rgb(var(--text-secondary))",
              }}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="text-[11px] truncate w-full">{p.name}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="space-y-3 pt-1">
        {/* Payload Message */}
        <div>
          <label className="block text-[10px] font-extrabold uppercase font-mono tracking-wider text-caption mb-1">
            Transaction Message
          </label>
          <input
            type="text"
            value={payload.message}
            onChange={(e) => updatePayload({ message: e.target.value })}
            className="w-full text-xs sm:text-sm font-semibold rounded-xl border px-3 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-heading"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: "rgb(var(--border))",
            }}
            placeholder="e.g. Transfer ₹10,000 to Bob"
            required
          />
        </div>

        {/* Sender & Receiver */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[9px] font-extrabold uppercase font-mono text-caption mb-1 flex items-center gap-1">
              <User className="h-3 w-3 text-indigo-400" />
              <span>Sender</span>
            </label>
            <input
              type="text"
              value={payload.sender}
              onChange={(e) => updatePayload({ sender: e.target.value })}
              className="w-full text-xs font-mono font-semibold rounded-xl border px-2.5 py-1.5 text-heading"
              style={{
                backgroundColor: "rgb(var(--surface-muted))",
                borderColor: "rgb(var(--border))",
              }}
              required
            />
          </div>
          <div>
            <label className="block text-[9px] font-extrabold uppercase font-mono text-caption mb-1 flex items-center gap-1">
              <ArrowRight className="h-3 w-3 text-indigo-400" />
              <span>Receiver</span>
            </label>
            <input
              type="text"
              value={payload.receiver}
              onChange={(e) => updatePayload({ receiver: e.target.value })}
              className="w-full text-xs font-mono font-semibold rounded-xl border px-2.5 py-1.5 text-heading"
              style={{
                backgroundColor: "rgb(var(--surface-muted))",
                borderColor: "rgb(var(--border))",
              }}
              required
            />
          </div>
        </div>

        {/* Bound Parameters Box */}
        <div className="rounded-xl p-3 border" style={{ backgroundColor: "rgb(var(--surface-muted))", borderColor: "rgb(var(--border))" }}>
          <div className="flex items-center justify-between mb-2 text-[10px] font-mono font-bold text-caption uppercase">
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-indigo-400" />
              <span>Bound Context Parameters</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="block text-[9px] text-caption uppercase font-mono">Session</span>
              <input
                type="text"
                value={payload.sessionId}
                onChange={(e) => updatePayload({ sessionId: e.target.value })}
                className="w-full text-[11px] font-mono font-bold rounded-lg border px-2 py-1 mt-0.5 text-heading"
                style={{
                  backgroundColor: "rgb(var(--surface))",
                  borderColor: "rgb(var(--border))",
                }}
              />
            </div>
            <div>
              <span className="block text-[9px] text-caption uppercase font-mono">Nonce</span>
              <input
                type="text"
                value={payload.nonce}
                onChange={(e) => updatePayload({ nonce: e.target.value })}
                className="w-full text-[11px] font-mono font-bold rounded-lg border px-2 py-1 mt-0.5 text-heading"
                style={{
                  backgroundColor: "rgb(var(--surface))",
                  borderColor: "rgb(var(--border))",
                }}
              />
            </div>
            <div>
              <span className="block text-[9px] text-caption uppercase font-mono">Sequence</span>
              <input
                type="number"
                value={payload.sequence}
                onChange={(e) => updatePayload({ sequence: parseInt(e.target.value, 10) || 1 })}
                className="w-full text-[11px] font-mono font-bold rounded-lg border px-2 py-1 mt-0.5 text-heading"
                style={{
                  backgroundColor: "rgb(var(--surface))",
                  borderColor: "rgb(var(--border))",
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <button
            type="submit"
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-black text-xs sm:text-sm text-white shadow-md shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:opacity-95 transition-all disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{isProcessing ? "Processing..." : "Create & Dispatch"}</span>
          </button>

          {/* THE HERO REPLAY BUTTON */}
          <button
            type="button"
            onClick={replayBaseline}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-black text-xs sm:text-sm transition-all border disabled:opacity-50 shadow-sm"
            style={{
              backgroundColor: baselineAuthorizedPacket
                ? "rgb(var(--danger-soft))"
                : "rgb(var(--surface-muted))",
              borderColor: baselineAuthorizedPacket
                ? "rgb(var(--danger))"
                : "rgb(var(--border))",
              color: baselineAuthorizedPacket
                ? "rgb(var(--danger))"
                : "rgb(var(--text-secondary))",
            }}
            title="Resend the exact same signed transaction without modifying anything"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Replay Same Request</span>
          </button>
        </div>

        {baselineAuthorizedPacket && (
          <div
            className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold border"
            style={{
              backgroundColor: "rgb(var(--accent-soft))",
              borderColor: "rgba(var(--accent), 0.3)",
              color: "rgb(var(--accent))",
            }}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>
              Baseline <strong>{baselineAuthorizedPacket.id}</strong> stored. Click <em>Replay Same Request</em> to see Guard 3 catch reuse!
            </span>
          </div>
        )}
      </form>
    </div>
  );
};
