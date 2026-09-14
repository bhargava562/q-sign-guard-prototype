import type {
  SignedTransactionPacket,
  SecurityDecision,
  SecurityStatus,
  AuthenticityStatus,
  ExecutionStatus,
  SecurityRuleCode,
  EvidenceItem,
} from "../types/transaction";
import type { SignatureProvider } from "./signatureProvider";
import { defaultSignatureProvider } from "./signatureProvider";
import { evaluateSignatureGuard } from "./signatureGuard";
import { evaluateContextGuard } from "./contextGuard";
import type { InMemoryReplayStore } from "./replayGuard";
import { defaultReplayStore } from "./replayGuard";

export interface EvaluationOptions {
  provider?: SignatureProvider;
  replayStore?: InMemoryReplayStore;
  currentTimeMs?: number;
}

export async function evaluateTransactionGateway(
  packet: SignedTransactionPacket,
  options: EvaluationOptions = {}
): Promise<{
  decision: SecurityDecision;
  guards: {
    signaturePassed: boolean;
    contextPassed: boolean;
    freshnessPassed: boolean;
  };
}> {
  const startTime = performance.now();
  const provider = options.provider ?? defaultSignatureProvider;
  const replayStore = options.replayStore ?? defaultReplayStore;
  const currentTimeMs = options.currentTimeMs ?? Date.now();

  const allEvidence: EvidenceItem[] = [];

  // --- GUARD 1: Cryptographic Signature Guard ---
  const sigResult = await evaluateSignatureGuard(packet, provider);
  allEvidence.push(...sigResult.evidence);

  // --- GUARD 2: Context Guard ---
  const ctxResult = evaluateContextGuard(packet);
  allEvidence.push(...ctxResult.evidence);

  // --- GUARD 3: Freshness & Replay Guard ---
  const freshnessResult = replayStore.checkFreshness(packet, currentTimeMs);
  allEvidence.push(...freshnessResult.evidence);

  const signaturePassed = sigResult.passed;
  const contextPassed = ctxResult.passed;
  const freshnessPassed = freshnessResult.passed;

  let status: SecurityStatus = "accepted";
  const authenticity: AuthenticityStatus = signaturePassed ? "valid" : "invalid";
  let execution: ExecutionStatus = "authorized";
  let ruleViolated: SecurityRuleCode = "NONE";
  let reason = "Transaction cryptographically authentic, contextually valid, and verified fresh.";

  if (!signaturePassed) {
    status = "blocked";
    execution = "blocked";
    ruleViolated = "SIGNATURE_MISMATCH";
    reason =
      sigResult.reason ||
      "Cryptographic signature invalid: Payload or signed context was altered in transit.";
  } else if (!contextPassed) {
    status = "blocked";
    execution = "blocked";
    ruleViolated = "SESSION_INVALID";
    reason =
      ctxResult.reason ||
      "Context authorization failed: Participant or session identity is not recognized.";
  } else if (!freshnessPassed) {
    status = "blocked";
    execution = "blocked";
    ruleViolated = freshnessResult.ruleViolated;
    reason =
      freshnessResult.reason ||
      "Freshness violation: Context has already been consumed or sequence is invalid.";
  } else {
    // ALL CHECKS PASSED: Commit state atomically to replay cache!
    replayStore.commitConsumption(packet);
  }

  const endTime = performance.now();
  const simulationLatencyMs = Math.round((endTime - startTime) * 100) / 100;

  const decision: SecurityDecision = {
    status,
    authenticity,
    execution,
    reason,
    ruleViolated,
    evidence: allEvidence,
    simulationLatencyMs,
    evaluatedAt: new Date(currentTimeMs).toISOString(),
  };

  return {
    decision,
    guards: {
      signaturePassed,
      contextPassed,
      freshnessPassed,
    },
  };
}
