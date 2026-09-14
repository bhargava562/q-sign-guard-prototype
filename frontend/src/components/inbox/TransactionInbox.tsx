import React from "react";
import {
  ArrowRight,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Inbox,
  Filter,
} from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";
import type { InboxTransactionItem } from "../../types/transaction";

export const TransactionInbox: React.FC = () => {
  const {
    inboxItems,
    inboxFilter,
    setInboxFilter,
    selectTransactionForReview,
    resetInbox,
  } = useSecurityStore();

  const filteredItems = inboxItems.filter((item) => {
    if (inboxFilter === "pending") return item.reviewStatus === "pending";
    if (inboxFilter === "authorized") return item.reviewStatus === "authorized";
    if (inboxFilter === "blocked") return item.reviewStatus === "blocked";
    return true;
  });

  const pendingCount = inboxItems.filter((i) => i.reviewStatus === "pending").length;
  const authorizedCount = inboxItems.filter((i) => i.reviewStatus === "authorized").length;
  const blockedCount = inboxItems.filter((i) => i.reviewStatus === "blocked").length;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-2">
      {/* Inbox Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="w-6 h-6 text-sky-500" />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-heading">
              Transaction Inbox
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-caption font-medium mt-0.5">
            {pendingCount > 0
              ? `${pendingCount} signed authorization ${pendingCount === 1 ? "request" : "requests"} awaiting gateway verification`
              : "All current ingress queue requests have been evaluated"}
          </p>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={resetInbox}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 hover:bg-slate-500/5 cursor-pointer"
          style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--text-secondary))" }}
          title="Reset sample ingress queue"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Ingress Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex items-center gap-1.5 p-1.5 rounded-2xl border backdrop-blur-sm self-start"
        style={{
          backgroundColor: "rgb(var(--surface-muted))",
          borderColor: "rgb(var(--border))",
        }}
      >
        <button
          type="button"
          onClick={() => setInboxFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            inboxFilter === "all" ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm" : "text-caption hover:text-heading"
          }`}
        >
          All ({inboxItems.length})
        </button>
        <button
          type="button"
          onClick={() => setInboxFilter("pending")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            inboxFilter === "pending" ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm" : "text-caption hover:text-heading"
          }`}
        >
          Awaiting Review ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setInboxFilter("authorized")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            inboxFilter === "authorized" ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-caption hover:text-heading"
          }`}
        >
          Authorized ({authorizedCount})
        </button>
        <button
          type="button"
          onClick={() => setInboxFilter("blocked")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            inboxFilter === "blocked" ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm" : "text-caption hover:text-heading"
          }`}
        >
          Blocked ({blockedCount})
        </button>
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-3.5">
        {filteredItems.map((item) => (
          <TransactionRow
            key={item.requestId}
            item={item}
            onSelect={() => selectTransactionForReview(item)}
          />
        ))}

        {filteredItems.length === 0 && (
          <div
            className="p-12 rounded-3xl border text-center flex flex-col items-center gap-2"
            style={{ backgroundColor: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
          >
            <Filter className="w-8 h-8 text-caption opacity-40" />
            <span className="text-sm font-bold text-heading">No transactions match this filter</span>
            <span className="text-xs text-caption">Select another filter tab to view transactions.</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface TransactionRowProps {
  item: InboxTransactionItem;
  onSelect: () => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ item, onSelect }) => {
  const isPending = item.reviewStatus === "pending";
  const isAuthorized = item.reviewStatus === "authorized";
  const isBlocked = item.reviewStatus === "blocked";

  return (
    <div
      onClick={onSelect}
      className="p-5 sm:p-6 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:shadow-md hover:border-sky-500/40 relative overflow-hidden group"
      style={{
        backgroundColor: "rgb(var(--surface))",
        borderColor: "rgb(var(--border))",
      }}
    >
      {/* Left colored status accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
          isPending
            ? "bg-sky-500"
            : isAuthorized
            ? "bg-emerald-500"
            : "bg-rose-500"
        }`}
      />

      {/* Main Content */}
      <div className="flex flex-col gap-2.5 flex-1 pl-2">
        {/* Top meta row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isPending && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              NEW · AWAITING REVIEW
            </span>
          )}
          {isAuthorized && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> AUTHORIZED
            </span>
          )}
          {isBlocked && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> BLOCKED
            </span>
          )}

          <span className="text-xs font-mono font-bold text-caption px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/20">
            {item.requestId}
          </span>

          <span className="text-xs text-caption font-medium">
            {item.source}
          </span>

          <span className="text-caption text-xs">•</span>

          <span className="text-xs text-caption font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-caption" />
            {item.receivedAt}
          </span>
        </div>

        {/* Sender -> Receiver & Amount */}
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-base sm:text-lg font-black text-heading">
            <span>{item.transaction.sender}</span>
            <ArrowRight className="w-4 h-4 text-sky-500" />
            <span>{item.transaction.receiver}</span>
          </div>

          <span className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400">
            {item.transaction.formattedAmount}
          </span>
        </div>

        {/* Message and Protocol preview */}
        <div className="flex items-center gap-4 text-xs font-mono text-caption flex-wrap">
          <span className="italic font-sans text-body">"{item.transaction.message}"</span>
          <span>•</span>
          <span>Session: {item.securityContext.sessionId}</span>
          <span>Seq: {item.securityContext.sequence}</span>
          <span>Nonce: {item.securityContext.nonce}</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline text-sky-600 dark:text-sky-400 font-semibold">
            {item.signature.algorithm} Attached
          </span>
        </div>
      </div>

      {/* Right Action Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="self-end sm:self-center py-2.5 px-4 rounded-xl font-black text-xs transition-all duration-150 flex items-center gap-2 cursor-pointer shrink-0 group-hover:scale-[1.02] bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20"
      >
        <span>{isPending ? "REVIEW REQUEST" : "INSPECT DECISION"}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
