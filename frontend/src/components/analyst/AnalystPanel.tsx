import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  XOctagon,
  ArrowRight,
} from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";
import { generateAnalystAssessment, getPresetQuestions } from "../../engine/analystEngine";

export const AnalystPanel: React.FC = () => {
  const {
    lastDecision,
    activePacket,
    selectedTransaction,
    returnToInbox,
    currentUser,
  } = useSecurityStore();

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>("q1_why_blocked");
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideCommitted, setOverrideCommitted] = useState(false);

  if (!lastDecision) return null;

  const assessment = generateAnalystAssessment(lastDecision, activePacket);
  const questions = getPresetQuestions(lastDecision, activePacket);
  const isBlocked = lastDecision.status !== "accepted";

  const handleOverride = () => {
    if (!selectedTransaction) return;
    setOverrideCommitted(true);
    setTimeout(() => {
      // Record override in audit log and return to inbox
      useSecurityStore.setState((state) => ({
        inboxItems: state.inboxItems.map((item) =>
          item.requestId === selectedTransaction.requestId
            ? { ...item, reviewStatus: "authorized" }
            : item
        ),
        auditEvents: [
          {
            id: `EV-${Date.now()}-OVERRIDE`,
            timestamp: new Date().toLocaleTimeString(),
            transactionId: selectedTransaction.requestId,
            summary: `HUMAN OVERRIDE: ${selectedTransaction.transaction.message} (Approved by ${currentUser.name})`,
            status: "accepted",
            authenticity: lastDecision.authenticity,
            execution: "authorized",
            ruleViolated: "NONE",
            reason: `Manual Operator Override: ${overrideReason || "Approved after review"}`,
            packet: state.activePacket || ({} as any),
            decision: {
              ...lastDecision,
              status: "accepted",
              execution: "authorized",
              reason: `Human Override by ${currentUser.name}: ${overrideReason || "Operator approved"}`,
            },
          },
          ...state.auditEvents,
        ],
      }));
      returnToInbox();
    }, 600);
  };

  return (
    <div
      className="w-full max-w-2xl rounded-2xl border p-5 sm:p-6 flex flex-col gap-5 text-left transition-all shadow-md relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--surface-muted))",
        borderColor: "rgb(var(--border))",
      }}
    >
      {/* Subtle AI gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

      {/* Header: Identity & Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-heading tracking-wide uppercase flex items-center gap-1.5">
              <span>Q-SignGuard Analyst</span>
            </h3>
            <span className="text-[11px] font-mono text-caption block">
              Evidence-based reasoning assistant · Model: Deterministic Policy Inspector
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
            assessment.risk === "HIGH"
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
              : assessment.risk === "MEDIUM"
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
          }`}
        >
          RISK: {assessment.risk}
        </span>
      </div>

      {/* Comparative Grid: Gateway Verdict vs Analyst Assessment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div
          className="p-3 rounded-xl border flex flex-col gap-1"
          style={{ backgroundColor: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
        >
          <span className="text-[10px] text-caption uppercase font-sans font-semibold">
            Gateway Verdict (Deterministic)
          </span>
          <span
            className={`text-sm font-black flex items-center gap-1.5 ${
              isBlocked ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isBlocked ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {lastDecision.execution === "authorized" ? "AUTHORIZED" : "BLOCKED"}
          </span>
          <span className="text-[10px] text-caption">Rule: {lastDecision.ruleViolated}</span>
        </div>

        <div
          className="p-3 rounded-xl border flex flex-col gap-1"
          style={{ backgroundColor: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
        >
          <span className="text-[10px] text-caption uppercase font-sans font-semibold">
            Analyst Assessment (Reasoning)
          </span>
          <span className="text-sm font-black text-heading flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            {assessment.assessment}
          </span>
          <span className="text-[10px] text-caption">Confidence: {assessment.confidence}</span>
        </div>
      </div>

      {/* Analyst Reasoning Explanations */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-caption">
          Evidence-Based Reasoning
        </span>
        <div
          className="p-3.5 rounded-xl border flex flex-col gap-2"
          style={{ backgroundColor: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
        >
          {assessment.reasoning.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <span className="text-sky-500 font-mono font-bold shrink-0">{idx + 1}.</span>
              <span className="text-body leading-relaxed">{item}</span>
            </div>
          ))}

          <div className="pt-2 mt-1 border-t flex items-center justify-between text-[11px] font-mono" style={{ borderColor: "rgb(var(--border))" }}>
            <span className="text-caption">Analyst Recommendation:</span>
            <span
              className={`font-black ${
                assessment.recommendation === "REJECT" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {assessment.recommendation === "REJECT" ? "REJECT THIS REQUEST" : "APPROVE EXECUTION"}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Q&A Accordion */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-caption flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
          <span>Ask Analyst About This Decision</span>
        </span>

        <div className="flex flex-col gap-1.5">
          {questions.map((q) => {
            const isOpen = activeQuestionId === q.id;
            return (
              <div
                key={q.id}
                className="rounded-xl border overflow-hidden transition-all text-xs"
                style={{ backgroundColor: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
              >
                <button
                  type="button"
                  onClick={() => setActiveQuestionId(isOpen ? null : q.id)}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-heading hover:bg-slate-500/5 transition-colors cursor-pointer text-left"
                >
                  <span>{q.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-caption" /> : <ChevronDown className="w-4 h-4 text-caption" />}
                </button>
                {isOpen && (
                  <div
                    className="p-3 border-t text-body font-mono text-xs leading-relaxed bg-sky-500/5"
                    style={{ borderColor: "rgb(var(--border))" }}
                  >
                    {q.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Human Operator Final Decision Area */}
      <div className="pt-3 border-t flex flex-col gap-2.5" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-heading flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-sky-500" />
            <span>Human Operator Decision Required</span>
          </span>
          <span className="text-[10px] font-mono text-caption">
            Operator: {currentUser.name}
          </span>
        </div>

        {isBlocked ? (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={returnToInbox}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <XOctagon className="w-3.5 h-3.5" />
              <span>Confirm Rejection</span>
            </button>

            <button
              type="button"
              onClick={() => setOverrideModalOpen(true)}
              className="py-2.5 px-4 rounded-xl font-bold text-xs border border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Override & Approve</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={returnToInbox}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Acknowledge & Return to Inbox</span>
          </button>
        )}
      </div>

      {/* Override Confirmation Modal */}
      {overrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md rounded-2xl border p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95"
            style={{ backgroundColor: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
          >
            <div className="flex items-center gap-2.5 text-amber-500">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="text-base font-black text-heading">Manual Execution Override</h4>
            </div>

            <p className="text-xs text-caption leading-relaxed">
              You are overriding the gateway's deterministic security invariant (
              <span className="font-mono font-bold text-rose-500">{lastDecision.ruleViolated}</span>).
              This action will be logged in the immutable audit trail under your operator signature.
            </p>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-heading">Override Authorization Rationale:</label>
              <input
                type="text"
                placeholder="e.g. Authorized duplicate payment approved by client phone call"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="p-2.5 rounded-xl border text-xs bg-transparent text-heading focus:outline-none focus:border-sky-500"
                style={{ borderColor: "rgb(var(--border))" }}
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setOverrideModalOpen(false)}
                className="py-2 px-3.5 rounded-xl text-xs font-bold text-caption hover:text-heading cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOverride}
                disabled={overrideCommitted}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer transition-all flex items-center gap-1"
              >
                {overrideCommitted ? "Committing..." : "Confirm Override & Settle"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
