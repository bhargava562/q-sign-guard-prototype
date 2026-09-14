import type { SignedTransactionPacket, EvidenceItem, SecurityRuleCode } from "../types/transaction";

export interface FreshnessGuardResult {
  passed: boolean;
  ruleViolated: SecurityRuleCode;
  reason?: string;
  evidence: EvidenceItem[];
}

export interface ReplayStoreState {
  consumedNonces: Set<string>;
  lastSequenceBySession: Map<string, number>;
  clockToleranceSec: number;
}

export class InMemoryReplayStore {
  private consumedNonces = new Set<string>();
  private lastSequenceBySession = new Map<string, number>();
  public clockToleranceSec = 30;

  constructor() {
    this.lastSequenceBySession.set("S-4821", 103);
    this.lastSequenceBySession.set("S-9901", 500);
    this.lastSequenceBySession.set("S-DEFAULT", 0);
  }

  checkFreshness(packet: SignedTransactionPacket, currentTimeMs: number = Date.now()): FreshnessGuardResult {
    const { nonce, sequence, issuedAt, expiresAt, sessionId } = packet.payload;
    const effectiveSessionId = packet.tamperedSessionId ?? sessionId;

    const evidence: EvidenceItem[] = [];
    let ruleViolated: SecurityRuleCode = "NONE";
    let reason: string | undefined;

    // 1. Nonce Uniqueness Check
    const nonceKey = `${effectiveSessionId}:${nonce}`;
    const isNonceConsumed = this.consumedNonces.has(nonceKey);

    evidence.push({
      id: "freshness_nonce",
      label: "Nonce Freshness",
      status: isNonceConsumed ? "fail" : "pass",
      observed: isNonceConsumed ? `${nonce} (ALREADY CONSUMED)` : `${nonce} (FRESH)`,
      expected: "Unseen / Fresh Nonce",
      description: isNonceConsumed
        ? "Nonce was previously authorized and consumed by the gateway. Replay attempt detected."
        : "Nonce is fresh and has never been executed in this session.",
    });

    if (isNonceConsumed) {
      ruleViolated = "REPLAY_NONCE_REUSED";
      reason = `Nonce '${nonce}' has already been consumed in session '${effectiveSessionId}'. Duplicate execution denied.`;
    }

    // 2. Strict Monotonic Sequence Check: sequence === lastSequence + 1
    const lastSequence = this.lastSequenceBySession.get(effectiveSessionId);
    let isSequenceValid = true;
    let expectedSequenceStr = "";

    if (lastSequence === undefined) {
      expectedSequenceStr = `Initial sequence (${sequence})`;
      isSequenceValid = true;
    } else {
      const expectedSequence = lastSequence + 1;
      expectedSequenceStr = `Strict Monotonic: ${expectedSequence}`;
      if (sequence !== expectedSequence) {
        isSequenceValid = false;
        if (ruleViolated === "NONE") {
          ruleViolated = "SEQUENCE_OUT_OF_ORDER";
          if (sequence <= lastSequence) {
            reason = `Sequence ${sequence} was already executed (latest executed sequence is ${lastSequence}). Repeated sequence denied.`;
          } else {
            reason = `Sequence gap detected: Received sequence ${sequence}, expected ${expectedSequence}. Out-of-order execution denied.`;
          }
        }
      }
    }

    evidence.push({
      id: "freshness_sequence",
      label: "Sequence Invariant",
      status: isSequenceValid ? "pass" : "fail",
      observed: `${sequence} (last recorded: ${lastSequence ?? "none"})`,
      expected: expectedSequenceStr,
      description: isSequenceValid
        ? "Sequence follows strict monotonic ordering (last + 1)."
        : `Violates per-session monotonic sequence rule. Expected ${lastSequence !== undefined ? lastSequence + 1 : sequence}.`,
    });

    // 3. Expiration and Clock Skew Check
    const issuedAtMs = new Date(issuedAt).getTime();
    const expiresAtMs = new Date(expiresAt).getTime();
    const skewMs = this.clockToleranceSec * 1000;

    const isNotExpired = currentTimeMs <= expiresAtMs + skewMs;
    const isNotPremature = currentTimeMs >= issuedAtMs - skewMs;
    const isTimingValid = isNotExpired && isNotPremature;

    evidence.push({
      id: "freshness_expiry",
      label: "Time Validity Window",
      status: isTimingValid ? "pass" : "fail",
      observed: `Expires: ${new Date(expiresAtMs).toLocaleTimeString()} (Tolerance: ±${this.clockToleranceSec}s)`,
      expected: `Now within [Issued - ${this.clockToleranceSec}s, Expires + ${this.clockToleranceSec}s]`,
      description: isTimingValid
        ? "Transaction is within legitimate execution time window."
        : currentTimeMs > expiresAtMs + skewMs
        ? "Transaction context has expired. Stale authorization rejected."
        : "Premature transaction timestamp outside clock skew tolerance.",
    });

    if (!isTimingValid && ruleViolated === "NONE") {
      ruleViolated = "CONTEXT_EXPIRED";
      reason = `Transaction context expired at ${new Date(expiresAtMs).toISOString()} (tolerance window ±${this.clockToleranceSec}s exceeded).`;
    }

    const passed = !isNonceConsumed && isSequenceValid && isTimingValid;

    return {
      passed,
      ruleViolated,
      reason,
      evidence,
    };
  }

  commitConsumption(packet: SignedTransactionPacket): void {
    const { nonce, sequence, sessionId } = packet.payload;
    const effectiveSessionId = packet.tamperedSessionId ?? sessionId;
    const nonceKey = `${effectiveSessionId}:${nonce}`;

    this.consumedNonces.add(nonceKey);
    this.lastSequenceBySession.set(effectiveSessionId, sequence);
  }

  isNonceConsumed(sessionId: string, nonce: string): boolean {
    return this.consumedNonces.has(`${sessionId}:${nonce}`);
  }

  getLastSequence(sessionId: string): number | undefined {
    return this.lastSequenceBySession.get(sessionId);
  }

  getStats() {
    return {
      totalTrackedSessions: this.lastSequenceBySession.size,
      totalTrackedNonces: this.consumedNonces.size,
    };
  }

  reset(): void {
    this.consumedNonces.clear();
    this.lastSequenceBySession.clear();
    this.lastSequenceBySession.set("S-4821", 103);
    this.lastSequenceBySession.set("S-9901", 500);
    this.lastSequenceBySession.set("S-DEFAULT", 0);
  }
}

export const defaultReplayStore = new InMemoryReplayStore();
