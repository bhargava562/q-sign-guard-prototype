import React from "react";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileSearch,
  Sparkles,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const TransactionWorkspace: React.FC = () => {
  const {
    operatorStage,
    payload,
    activePacket,
    guardStates,
    lastDecision,
    isProcessing,
    verifyAndProcess,
    triggerDuplicateArrival,
    processDuplicate,
    testInvalidScenario,
    resetToIncoming,
    openEvidenceSheet,
    selectedIncomingRequest,
  } = useSecurityStore();

  const isReplayStage = operatorStage === "duplicate-arrived" || operatorStage === "duplicate-verifying";
  const isBlocked = operatorStage === "blocked";
  const isAuthorized = operatorStage === "authorized";
  const isVerifying = operatorStage === "verifying" || operatorStage === "duplicate-verifying";

  return (
    <div className="w-full flex flex-col gap-6 py-2">
      {/* ── MAIN TRANSACTION PROTAGONIST CARD ── */}
      <div
        className="w-full max-w-4xl mx-auto rounded-3xl border p-6 sm:p-10 shadow-lg transition-all relative overflow-hidden"
        style={{
          backgroundColor: "rgb(var(--surface))",
          borderColor: "rgb(var(--border))",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isAuthorized
              ? "bg-emerald-500/15"
              : isBlocked
              ? "bg-rose-500/15"
              : "bg-sky-500/10"
          }`}
        />

        {/* Header Ribbon / Stage Indicator */}
        <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAuthorized
                  ? "bg-emerald-500"
                  : isBlocked
                  ? "bg-rose-500"
                  : isVerifying
                  ? "bg-amber-500 animate-pulse"
                  : "bg-sky-500"
              }`}
            />
            <span className="text-xs font-mono font-black uppercase tracking-wider text-caption">
              {operatorStage === "incoming" && "Incoming Authorization Request"}
              {operatorStage === "verifying" && "Evaluating Gateway Protocol Invariants..."}
              {operatorStage === "authorized" && "Gateway Execution Authorized"}
              {operatorStage === "duplicate-arrived" && "Incoming Duplicate Transaction Captured"}
              {operatorStage === "duplicate-verifying" && "Evaluating Duplicate Request..."}
              {operatorStage === "blocked" && "Transaction Blocked by Gateway Policy"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              {activePacket?.id || selectedIncomingRequest.requestId || `TX-${payload.sequence}`}
            </span>
            {isReplayStage && (
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                REPLAY ATTEMPT
              </span>
            )}
          </div>
        </div>

        {/* ── SCREEN 1 & 4: INCOMING / DUPLICATE TRANSACTION VIEW ── */}
        {(operatorStage === "incoming" || operatorStage === "duplicate-arrived") && (
          <div className="py-8 flex flex-col items-center text-center gap-7">
            {/* Top Label */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono font-bold tracking-widest text-caption uppercase">
                {operatorStage === "duplicate-arrived"
                  ? "Re-transmitted Request (Identical Signature)"
                  : "Incoming Payment Request"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-heading">
                {operatorStage === "duplicate-arrived"
                  ? "Duplicate Signed Transaction Arrived"
                  : "Authorization Pending Execution"}
              </h2>
            </div>

            {/* Sender -> Receiver Flow Banner */}
            <div
              className="w-full max-w-xl p-6 sm:p-8 rounded-2xl border shadow-inner flex flex-col items-center gap-4"
              style={{
                backgroundColor: "rgb(var(--surface-muted))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
                {/* Sender */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-caption uppercase">Signer / Sender</span>
                  <span className="text-lg sm:text-xl font-black text-heading">
                    {payload.sender}
                  </span>
                  <span className="text-[11px] font-mono text-caption">Public Key Verified</span>
                </div>

                {/* Arrow & Amount */}
                <div className="flex-1 flex flex-col items-center gap-1 px-2">
                  <span className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400">
                    {selectedIncomingRequest.amount}
                  </span>
                  <div className="w-full flex items-center">
                    <div className="h-[2px] flex-1 bg-sky-500/40" />
                    <ArrowRight className="w-5 h-5 text-sky-500 shrink-0 mx-1" />
                    <div className="h-[2px] flex-1 bg-sky-500/40" />
                  </div>
                  <span className="text-[11px] font-medium text-caption italic">
                    "{payload.message}"
                  </span>
                </div>

                {/* Receiver */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-caption uppercase">Target Recipient</span>
                  <span className="text-lg sm:text-xl font-black text-heading">
                    {payload.receiver}
                  </span>
                  <span className="text-[11px] font-mono text-caption">Registered Account</span>
                </div>
              </div>

              {/* Protocol Metadata Grid */}
              <div
                className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-2 border-t text-left font-mono text-xs"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                <div>
                  <span className="text-[10px] text-caption uppercase block font-sans">Session ID</span>
                  <span className="font-bold text-heading">{payload.sessionId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-caption uppercase block font-sans">Sequence</span>
                  <span className="font-bold text-heading">{payload.sequence}</span>
                </div>
                <div>
                  <span className="text-[10px] text-caption uppercase block font-sans">Nonce</span>
                  <span className="font-bold text-heading text-sky-600 dark:text-sky-400">{payload.nonce}</span>
                </div>
                <div>
                  <span className="text-[10px] text-caption uppercase block font-sans">Validity (TTL)</span>
                  <span className="font-bold text-emerald-500">15 min window</span>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col items-center gap-3 w-full max-w-md">
              {operatorStage === "incoming" ? (
                <button
                  type="button"
                  onClick={verifyAndProcess}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-3 shadow-xl shadow-sky-600/30 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>VERIFY & EXECUTE</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={processDuplicate}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-amber-600 hover:bg-amber-500 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-3 shadow-xl shadow-amber-600/30 cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>PROCESS REQUEST (DUPLICATE)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              {/* Sub-label journey indicator */}
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-caption">
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
        )}

        {/* ── SCREEN 2: VERIFYING TRANSIT ANIMATION ── */}
        {isVerifying && (
          <div className="py-12 flex flex-col items-center text-center gap-8">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest text-caption uppercase">
                Gateway Evaluation Engine
              </span>
              <h2 className="text-2xl font-black text-heading">
                Verifying Transaction Through 4 Protocol Gates
              </h2>
            </div>

            {/* The 4 Gates Progression */}
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
              {/* Gate 1 */}
              <div
                className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                  guardStates.signaturePassed === true
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : guardStates.signaturePassed === false
                    ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    : "border-sky-500/40 bg-sky-500/5 animate-pulse"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span>1. AUTHENTICITY</span>
                  {guardStates.signaturePassed === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {guardStates.signaturePassed === false && <XCircle className="w-4 h-4 text-rose-500" />}
                </div>
                <span className="text-xs font-semibold">ML-DSA-65 (NIST FIPS 204)</span>
                <span className="text-[10px] text-caption font-mono">
                  {guardStates.signaturePassed === true
                    ? "Valid Signature"
                    : guardStates.signaturePassed === false
                    ? "Signature Mismatch"
                    : "Verifying signature..."}
                </span>
              </div>

              {/* Gate 2 */}
              <div
                className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                  guardStates.contextPassed === true
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : guardStates.contextPassed === false
                    ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    : guardStates.signaturePassed !== null
                    ? "border-sky-500/40 bg-sky-500/5 animate-pulse"
                    : "opacity-40 border-slate-300 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span>2. CONTEXT</span>
                  {guardStates.contextPassed === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {guardStates.contextPassed === false && <XCircle className="w-4 h-4 text-rose-500" />}
                </div>
                <span className="text-xs font-semibold">Identity & Session</span>
                <span className="text-[10px] text-caption font-mono">
                  {guardStates.contextPassed === true
                    ? "Authorized Context"
                    : guardStates.contextPassed === false
                    ? "Context Violation"
                    : "Checking bindings..."}
                </span>
              </div>

              {/* Gate 3 */}
              <div
                className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                  guardStates.freshnessPassed === true
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : guardStates.freshnessPassed === false
                    ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    : guardStates.contextPassed !== null
                    ? "border-sky-500/40 bg-sky-500/5 animate-pulse"
                    : "opacity-40 border-slate-300 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span>3. FRESHNESS</span>
                  {guardStates.freshnessPassed === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {guardStates.freshnessPassed === false && <XCircle className="w-4 h-4 text-rose-500" />}
                </div>
                <span className="text-xs font-semibold">Nonce & Sequence</span>
                <span className="text-[10px] text-caption font-mono">
                  {guardStates.freshnessPassed === true
                    ? "Fresh Nonce"
                    : guardStates.freshnessPassed === false
                    ? "Reused Nonce"
                    : "Querying Replay Store..."}
                </span>
              </div>

              {/* Gate 4 */}
              <div
                className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                  isAuthorized
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : isBlocked
                    ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    : "opacity-40 border-slate-300 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span>4. GATE</span>
                  {isAuthorized && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {isBlocked && <XCircle className="w-4 h-4 text-rose-500" />}
                </div>
                <span className="text-xs font-semibold">Execution Gate</span>
                <span className="text-[10px] text-caption font-mono">
                  {isAuthorized ? "AUTHORIZED" : isBlocked ? "BLOCKED" : "Pending decision..."}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── SCREEN 3: AUTHORIZATION SUCCEEDED ── */}
        {isAuthorized && (
          <div className="py-8 flex flex-col items-center text-center gap-7">
            {/* Status Hero */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                  ✓ EXECUTION AUTHORIZED
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-heading">
                  ₹10,000 Transferred ({payload.sender} → {payload.receiver})
                </h2>
              </div>
            </div>

            {/* Crucial State Transition Box */}
            <div
              className="w-full max-w-xl p-5 rounded-2xl border text-left flex flex-col gap-3"
              style={{
                backgroundColor: "rgb(var(--surface-muted))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Authorization Consumed. Nonce Committed.</span>
              </div>
              <p className="text-xs text-caption leading-relaxed">
                The gateway verified the ML-DSA-65 signature, validated the session context, confirmed freshness, and committed nonce{" "}
                <span className="font-mono font-bold text-heading">{payload.nonce}</span> to the stateful replay store.
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t text-caption" style={{ borderColor: "rgb(var(--border))" }}>
                <span>Session: {payload.sessionId}</span>
                <span>Sequence: {payload.sequence}</span>
                <span>Replay Ledger: Nonce Active</span>
              </div>
            </div>

            {/* Action to proceed to the Killer Moment */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={triggerDuplicateArrival}
                className="flex-1 w-full py-3.5 px-5 rounded-2xl font-black text-sm text-white bg-amber-600 hover:bg-amber-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Process Next Request (Duplicate TX-104)</span>
              </button>

              <button
                type="button"
                onClick={() => openEvidenceSheet()}
                className="py-3.5 px-5 rounded-2xl font-bold text-sm border hover:bg-slate-500/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--text-secondary))" }}
              >
                <FileSearch className="w-4 h-4" />
                <span>View Evidence</span>
              </button>
            </div>
          </div>
        )}

        {/* ── SCREEN 5: THE KILLER MOMENT - EXECUTION BLOCKED ── */}
        {isBlocked && (
          <div className="py-8 flex flex-col items-center text-center gap-7">
            {/* Gate Summary Progress */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono font-bold">
              <span className="flex items-center gap-1 text-emerald-500">
                <CheckCircle2 className="w-4 h-4" /> AUTHENTICITY
              </span>
              <span className="text-caption">→</span>
              <span
                className={`flex items-center gap-1 ${
                  lastDecision?.ruleViolated === "SESSION_INVALID" ? "text-rose-500" : "text-emerald-500"
                }`}
              >
                {lastDecision?.ruleViolated === "SESSION_INVALID" ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}{" "}
                CONTEXT
              </span>
              <span className="text-caption">→</span>
              <span
                className={`flex items-center gap-1 ${
                  lastDecision?.ruleViolated === "REPLAY_NONCE_REUSED" || lastDecision?.ruleViolated === "CONTEXT_EXPIRED"
                    ? "text-rose-500"
                    : lastDecision?.authenticity === "invalid"
                    ? "text-caption opacity-40"
                    : "text-emerald-500"
                }`}
              >
                {lastDecision?.ruleViolated === "REPLAY_NONCE_REUSED" || lastDecision?.ruleViolated === "CONTEXT_EXPIRED" ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}{" "}
                FRESHNESS
              </span>
              <span className="text-caption">→</span>
              <span className="flex items-center gap-1 text-rose-500">
                <XCircle className="w-4 h-4" /> EXECUTION GATE
              </span>
            </div>

            {/* Central Killer Statement */}
            <div
              className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 flex flex-col items-center gap-3 shadow-xl"
            >
              <span className="text-xs font-mono font-black uppercase tracking-widest text-rose-500">
                PROTOCOL STATE ENFORCEMENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                THE SIGNATURE IS VALID.
                <br />
                THE EXECUTION IS NOT.
              </h2>
              <p className="text-xs sm:text-sm max-w-lg text-rose-800/80 dark:text-rose-200/80 leading-relaxed font-medium">
                {lastDecision?.reason || `Nonce ${payload.nonce} was already consumed by transaction TX-104.`}
              </p>
            </div>

            {/* Replay Details Card */}
            <div
              className="w-full max-w-xl p-4 sm:p-5 rounded-2xl border text-left font-mono text-xs flex flex-col gap-2"
              style={{
                backgroundColor: "rgb(var(--surface-muted))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                <span className="text-caption font-sans font-semibold">Violation Rule Code:</span>
                <span className="font-bold text-rose-500">{lastDecision?.ruleViolated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-caption font-sans">Cryptographic Signature:</span>
                <span className="font-bold text-emerald-500">VALID (ML-DSA-65)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-caption font-sans">Observed State:</span>
                <span className="font-bold text-heading">CONSUMED NONCE IN MEMORY STORE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-caption font-sans">Execution Verdict:</span>
                <span className="font-bold text-rose-500 uppercase">BLOCKED (0 funds dispatched)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={() => openEvidenceSheet()}
                className="flex-1 w-full py-3.5 px-5 rounded-2xl font-black text-sm text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 cursor-pointer"
              >
                <FileSearch className="w-4 h-4" />
                <span>VIEW EVIDENCE</span>
              </button>

              <button
                type="button"
                onClick={resetToIncoming}
                className="py-3.5 px-5 rounded-2xl font-bold text-sm border hover:bg-slate-500/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--text-secondary))" }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Process Next Request</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── OPERATOR QUICK TEST CONTROLS (At bottom, unobtrusive) ── */}
      <div
        className="w-full max-w-4xl mx-auto rounded-2xl border p-4 sm:p-5 flex flex-col gap-3 transition-colors"
        style={{
          backgroundColor: "rgb(var(--surface))",
          borderColor: "rgb(var(--border))",
        }}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-heading flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Operator Test Scenarios
          </span>
          <span className="text-caption font-mono text-[11px]">
            Test isolated guard failure conditions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {/* Default P2P Reset */}
          <button
            type="button"
            onClick={resetToIncoming}
            className="p-2.5 rounded-xl border text-left hover:border-sky-500/50 transition-all text-xs flex flex-col gap-1 cursor-pointer"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <span className="font-bold text-heading">Standard TX-104</span>
            <span className="text-[10px] text-caption">Alice → Bob ₹10,000 (Valid)</span>
          </button>

          {/* Tamper Payload */}
          <button
            type="button"
            onClick={() => testInvalidScenario("tamper-message")}
            className="p-2.5 rounded-xl border text-left hover:border-rose-500/50 transition-all text-xs flex flex-col gap-1 cursor-pointer"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <span className="font-bold text-rose-500">Tampered Payload</span>
            <span className="text-[10px] text-caption">Signature Guard FAIL</span>
          </button>

          {/* Unauthorized Context */}
          <button
            type="button"
            onClick={() => testInvalidScenario("unauthorized-context")}
            className="p-2.5 rounded-xl border text-left hover:border-amber-500/50 transition-all text-xs flex flex-col gap-1 cursor-pointer"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <span className="font-bold text-amber-500">Revoked Session</span>
            <span className="text-[10px] text-caption">Sig PASS, Context FAIL</span>
          </button>

          {/* Expired TTL */}
          <button
            type="button"
            onClick={() => testInvalidScenario("expired-ttl")}
            className="p-2.5 rounded-xl border text-left hover:border-violet-500/50 transition-all text-xs flex flex-col gap-1 cursor-pointer"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <span className="font-bold text-violet-500">Expired Timestamp</span>
            <span className="text-[10px] text-caption">Sig PASS, Freshness FAIL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
