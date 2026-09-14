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
      name: "₹45.5k Settlement",
      icon: ShoppingBag,
      message: "Merchant Settlement ₹45,500",
      sender: "hot_wallet_corp",
      receiver: "merchant_gateway",
      sessionId: "S-4821",
    },
  ];

  return (
    <div
      className="flex flex-col rounded-2xl border p-4 sm:p-5 shadow-sm transition-all backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(var(--surface), 0.95)",
        borderColor: "rgb(var(--border))",
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>TRANSACTION INTAKE</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {payload.sender}
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={randomizeTransaction}
          disabled={isProcessing}
          className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors"
          style={{ color: "rgb(var(--foreground))" }}
          title="Generate fresh random Nonce and increment Sequence"
        >
          <Shuffle className="h-3.5 w-3.5 text-indigo-500" />
          <span className="hidden sm:inline font-mono">Randomize</span>
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
                  ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 font-bold"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
              }`}
            >
              <Icon className={`h-4 w-4 mb-1 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
              <span className="text-[11px] truncate w-full">{p.name}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="space-y-3 pt-1">
        {/* Payload Message */}
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Transaction Message
          </label>
          <input
            type="text"
            value={payload.message}
            onChange={(e) => updatePayload({ message: e.target.value })}
            className="w-full text-xs sm:text-sm font-semibold rounded-xl border px-3 py-2 transition-all focus:ring-2 focus:ring-indigo-500/20"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: "rgb(var(--border))",
              color: "rgb(var(--foreground))",
            }}
            placeholder="e.g. Transfer ₹10,000 to Bob"
            required
          />
        </div>

        {/* Sender & Receiver */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10px] font-extrabold uppercase font-mono text-slate-400 mb-1 flex items-center gap-1">
              <User className="h-3 w-3 text-indigo-500" />
              <span>Sender</span>
            </label>
            <input
              type="text"
              value={payload.sender}
              onChange={(e) => updatePayload({ sender: e.target.value })}
              className="w-full text-xs font-mono font-semibold rounded-xl border px-2.5 py-1.5"
              style={{
                backgroundColor: "rgb(var(--surface-muted))",
                borderColor: "rgb(var(--border))",
                color: "rgb(var(--foreground))",
              }}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-extrabold uppercase font-mono text-slate-400 mb-1 flex items-center gap-1">
              <ArrowRight className="h-3 w-3 text-indigo-500" />
              <span>Receiver</span>
            </label>
            <input
              type="text"
              value={payload.receiver}
              onChange={(e) => updatePayload({ receiver: e.target.value })}
              className="w-full text-xs font-mono font-semibold rounded-xl border px-2.5 py-1.5"
              style={{
                backgroundColor: "rgb(var(--surface-muted))",
                borderColor: "rgb(var(--border))",
                color: "rgb(var(--foreground))",
              }}
              required
            />
          </div>
        </div>

        {/* Bound Parameters Box */}
        <div className="rounded-xl p-3 border border-slate-200 dark:border-slate-800" style={{ backgroundColor: "rgb(var(--surface-muted))" }}>
          <div className="flex items-center justify-between mb-2 text-[10px] font-mono font-bold text-slate-400 uppercase">
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-indigo-500" />
              <span>Bound Context Parameters</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="block text-[9px] text-slate-400 uppercase font-mono">Session</span>
              <input
                type="text"
                value={payload.sessionId}
                onChange={(e) => updatePayload({ sessionId: e.target.value })}
                className="w-full text-[11px] font-mono font-bold rounded-lg border px-2 py-1 mt-0.5"
                style={{
                  backgroundColor: "rgb(var(--surface))",
                  borderColor: "rgb(var(--border))",
                  color: "rgb(var(--foreground))",
                }}
              />
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 uppercase font-mono">Nonce</span>
              <input
                type="text"
                value={payload.nonce}
                onChange={(e) => updatePayload({ nonce: e.target.value })}
                className="w-full text-[11px] font-mono font-bold rounded-lg border px-2 py-1 mt-0.5"
                style={{
                  backgroundColor: "rgb(var(--surface))",
                  borderColor: "rgb(var(--border))",
                  color: "rgb(var(--foreground))",
                }}
              />
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 uppercase font-mono">Sequence</span>
              <input
                type="number"
                value={payload.sequence}
                onChange={(e) => updatePayload({ sequence: parseInt(e.target.value, 10) || 1 })}
                className="w-full text-[11px] font-mono font-bold rounded-lg border px-2 py-1 mt-0.5"
                style={{
                  backgroundColor: "rgb(var(--surface))",
                  borderColor: "rgb(var(--border))",
                  color: "rgb(var(--foreground))",
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
            className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-extrabold text-xs sm:text-sm text-white shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition-all disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{isProcessing ? "Processing..." : "Create & Dispatch"}</span>
          </button>

          {/* THE HERO REPLAY BUTTON */}
          <button
            type="button"
            onClick={replayBaseline}
            disabled={isProcessing}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-extrabold text-xs sm:text-sm transition-all border disabled:opacity-50 ${
              baselineAuthorizedPacket
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500/80 text-rose-600 dark:text-rose-400 shadow-md shadow-rose-500/10 hover:bg-rose-100"
                : "border-slate-200 dark:border-slate-800 text-slate-500"
            }`}
            title="Resend the exact same signed transaction without modifying anything (demonstrates replay prevention)"
          >
            <RotateCcw className="h-4 w-4 text-rose-500" />
            <span>Replay Same Request</span>
          </button>
        </div>

        {baselineAuthorizedPacket && (
          <div className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
            <ShieldCheck className="h-4 w-4 text-indigo-500 shrink-0" />
            <span>
              Baseline <strong>{baselineAuthorizedPacket.id}</strong> stored. Click <em>Replay Same Request</em> to see Guard 3 catch reuse!
            </span>
          </div>
        )}
      </form>
    </div>
  );
};
