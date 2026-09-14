import type {
  SignedTransactionPacket,
  SecurityDecision,
  SecurityStatus,
  AuthenticityStatus,
  ExecutionStatus,
  SecurityRuleCode,
  EvidenceItem,
} from "../types/transaction";
import type { GatewayTraceEvent } from "../types/gatewayTrace";
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
  onTrace?: (event: GatewayTraceEvent) => Promise<void> | void;
  traceDelayMs?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const delay = options.traceDelayMs ?? 200;

  const emitTrace = async (event: Omit<GatewayTraceEvent, "id" | "timestamp">) => {
    if (options.onTrace) {
      const now = new Date();
      const timeStr = `${now.toTimeString().split(" ")[0]}.${String(now.getMilliseconds()).padStart(3, "0")}`;
      const fullEvent: GatewayTraceEvent = {
        ...event,
        id: `tr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: timeStr,
      };
      await options.onTrace(fullEvent);
      if (delay > 0) {
        await sleep(delay);
      }
    }
  };

  const allEvidence: EvidenceItem[] = [];

  // 1. Stage: Ingress Packet Received
  await emitTrace({
    stage: "received",
    operation: `RX packet ${packet.id} received from ingress gateway`,
    status: "success",
    metadata: {
      requestId: packet.id,
      sender: packet.payload.sender,
      receiver: packet.payload.receiver,
      message: packet.payload.message,
    },
    rawSnippet: JSON.stringify(packet.payload, null, 2),
  });

  // 2. Stage: Parse Ingress Payload
  await emitTrace({
    stage: "parsed",
    operation: `Decoding ingress payload: session=${packet.payload.sessionId} seq=${packet.payload.sequence} nonce=${packet.payload.nonce}`,
    status: "success",
    metadata: {
      fields: "8",
      session: packet.payload.sessionId,
      sequence: String(packet.payload.sequence),
      nonce: packet.payload.nonce,
    },
  });

  // 3. Stage: RFC 8785 Canonicalization (JCS)
  await emitTrace({
    stage: "canonicalized",
    operation: `RFC 8785 JSON Canonicalization (JCS) serialization complete`,
    status: "success",
    output: `JCS byte length: ${packet.canonicalJson.length}`,
    metadata: {
      standard: "RFC 8785",
      lexicographicalKeys: "sorted",
    },
    rawSnippet: packet.canonicalJson,
  });

  // 4. Stage: SHA-256 Context Commitment Digest
  await emitTrace({
    stage: "hashed",
    operation: `SHA-256 context commitment digest: ${packet.contextHashHex.slice(0, 24)}...`,
    status: "success",
    output: packet.contextHashHex,
    metadata: {
      algorithm: "SHA-256",
      digestHex: packet.contextHashHex,
    },
  });

  // --- GUARD 1: Cryptographic Signature Guard ---
  const sigResult = await evaluateSignatureGuard(packet, provider);
  allEvidence.push(...sigResult.evidence);

  await emitTrace({
    stage: "signature-verification",
    operation: sigResult.passed
      ? `ML-DSA-65 Demonstration Provider: SIGNATURE VALID`
      : `ML-DSA-65 Demonstration Provider: SIGNATURE MISMATCH`,
    status: sigResult.passed ? "success" : "failure",
    metadata: {
      algorithm: packet.algorithm,
      fingerprint: packet.publicKeyFingerprint || "7A:91:4F:2D:8C:77:E1:90:3B:5A:6D:88",
      verification: sigResult.passed ? "VALID" : "MISMATCH",
      signedHashHex: sigResult.signedHashHex || packet.contextHashHex,
      computedHashHex: sigResult.computedHashHex,
      reason: sigResult.reason || "",
    },
  });

  // --- GUARD 2: Context Guard ---
  const ctxResult = evaluateContextGuard(packet);
  allEvidence.push(...ctxResult.evidence);

  await emitTrace({
    stage: "context-resolution",
    operation: ctxResult.passed
      ? `Context Guard: Session '${packet.payload.sessionId}' is ACTIVE & AUTHORIZED`
      : `Context Guard: Context authorization failed: ${ctxResult.reason || "Unauthorized"}`,
    status: ctxResult.passed ? "success" : "failure",
    metadata: {
      sessionId: packet.payload.sessionId,
      sender: packet.payload.sender,
      receiver: packet.payload.receiver,
      status: ctxResult.passed ? "ACTIVE" : "REJECTED",
    },
  });

  // --- GUARD 3: Freshness & Replay Guard ---
  const freshnessResult = replayStore.checkFreshness(packet, currentTimeMs);
  allEvidence.push(...freshnessResult.evidence);

  await emitTrace({
    stage: "replay-check",
    operation: freshnessResult.passed
      ? `Replay Store: Nonce '${packet.payload.nonce}' is FRESH (Not consumed)`
      : `Replay Store: ${freshnessResult.reason || "Nonce already consumed (Replay detected)"}`,
    status: freshnessResult.passed ? "success" : "failure",
    metadata: {
      nonce: packet.payload.nonce,
      sequence: String(packet.payload.sequence),
      nonceStatus: freshnessResult.passed ? "FRESH" : "CONSUMED",
      sequenceStatus: freshnessResult.ruleViolated === "SEQUENCE_OUT_OF_ORDER" ? "OUT_OF_ORDER" : "MONOTONIC_VALID",
    },
  });

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

  // 8. Stage: Execution Gate
  await emitTrace({
    stage: "execution-gate",
    operation:
      status === "accepted"
        ? `Execution Gate: SETTLEMENT AUTHORIZATION GRANTED (Nonce ${packet.payload.nonce} committed)`
        : `Execution Gate: EXECUTION BLOCKED (Rule: ${ruleViolated})`,
    status: status === "accepted" ? "success" : "failure",
    metadata: {
      verdict: execution,
      rule: ruleViolated,
    },
  });

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
