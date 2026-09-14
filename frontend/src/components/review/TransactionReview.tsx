import React from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, Layers, Hash, Calendar } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";
import { SignatureArtifact } from "./SignatureArtifact";

export const TransactionReview: React.FC = () => {
  const { selectedTransaction, returnToInbox, verifyAndExecute, isProcessing } = useSecurityStore();

  if (!selectedTransaction) return null;

  const { transaction, securityContext, signature, requestId, source, receivedAt } = selectedTransaction;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={returnToInbox}
          className="flex items-center gap-2 text-xs font-bold text-caption hover:text-heading transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Transaction Inbox</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-caption px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20">
            {source}
          </span>
          <span className="text-xs font-mono text-caption">
            Received {receivedAt}
          </span>
        </div>
      </div>

      {/* Main Review Card */}
      <div
        className="rounded-3xl border p-6 sm:p-9 shadow-lg flex flex-col gap-7 transition-all relative overflow-hidden"
        style={{
          backgroundColor: "rgb(var(--surface))",
          borderColor: "rgb(var(--border))",
        }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-5 border-b" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-xs font-mono font-black uppercase tracking-wider text-caption">
              Incoming Signed Transaction Review
            </span>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            {requestId}
          </span>
        </div>

        {/* Sender -> Receiver & Amount Spotlight */}
        <div
          className="p-6 sm:p-8 rounded-2xl border flex flex-col items-center gap-4 text-center shadow-inner"
          style={{
            backgroundColor: "rgb(var(--surface-muted))",
            borderColor: "rgb(var(--border))",
          }}
        >
          <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
            {/* Sender */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold text-caption uppercase">Signer / Sender</span>
              <span className="text-xl sm:text-2xl font-black text-heading">
                {transaction.sender}
              </span>
              <span className="text-[11px] font-mono text-caption">Identity Registered</span>
            </div>

            {/* Amount and arrow */}
            <div className="flex-1 flex flex-col items-center gap-1 px-2">
              <span className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 tracking-tight">
                {transaction.formattedAmount}
              </span>
              <div className="w-full flex items-center max-w-[240px]">
                <div className="h-[2px] flex-1 bg-sky-500/40" />
                <ArrowRight className="w-5 h-5 text-sky-500 shrink-0 mx-1.5" />
                <div className="h-[2px] flex-1 bg-sky-500/40" />
              </div>
              <span className="text-xs font-medium text-caption italic">
                "{transaction.message}"
              </span>
            </div>

            {/* Receiver */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold text-caption uppercase">Target Recipient</span>
              <span className="text-xl sm:text-2xl font-black text-heading">
                {transaction.receiver}
              </span>
              <span className="text-[11px] font-mono text-caption">Verified Destination</span>
            </div>
          </div>
        </div>

        {/* Request Context Grid */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-caption">
            Protocol Security Context
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div
              className="p-3 rounded-xl border flex flex-col gap-1"
              style={{ backgroundColor: "rgb(var(--surface-muted))", borderColor: "rgb(var(--border))" }}
            >
              <span className="text-[10px] text-caption uppercase font-sans font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3 text-sky-500" /> Session ID
              </span>
              <span className="font-bold text-heading">{securityContext.sessionId}</span>
            </div>

            <div
              className="p-3 rounded-xl border flex flex-col gap-1"
              style={{ backgroundColor: "rgb(var(--surface-muted))", borderColor: "rgb(var(--border))" }}
            >
              <span className="text-[10px] text-caption uppercase font-sans font-semibold flex items-center gap-1">
                <Hash className="w-3 h-3 text-sky-500" /> Monotonic Sequence
              </span>
              <span className="font-bold text-heading">{securityContext.sequence}</span>
            </div>

            <div
              className="p-3 rounded-xl border flex flex-col gap-1"
              style={{ backgroundColor: "rgb(var(--surface-muted))", borderColor: "rgb(var(--border))" }}
            >
              <span className="text-[10px] text-caption uppercase font-sans font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-500" /> Ingress Nonce
              </span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{securityContext.nonce}</span>
            </div>

            <div
              className="p-3 rounded-xl border flex flex-col gap-1"
              style={{ backgroundColor: "rgb(var(--surface-muted))", borderColor: "rgb(var(--border))" }}
            >
              <span className="text-[10px] text-caption uppercase font-sans font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-sky-500" /> Validity Window
              </span>
              <span className="font-bold text-emerald-500">15 min allowable</span>
            </div>
          </div>
        </div>

        {/* Cryptographic Signature Visualization */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-caption">
            Attached Cryptographic Seal
          </span>

          <SignatureArtifact
            signature={signature}
            signerName={transaction.sender}
          />
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="button"
            onClick={verifyAndExecute}
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-3 shadow-xl shadow-sky-600/30 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>VERIFY & EXECUTE</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-caption">
            <span>Authenticity</span>
            <span>→</span>
            <span>Context</span>
            <span>→</span>
            <span>Freshness</span>
            <span>→</span>
            <span>Execution Gate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
