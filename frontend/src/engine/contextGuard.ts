import type { SignedTransactionPacket, EvidenceItem } from "../types/transaction";

export interface ContextGuardResult {
  passed: boolean;
  reason?: string;
  evidence: EvidenceItem[];
}

import identitiesData from "../data/identities.json";
import sessionsData from "../data/sessions.json";

const AUTHORIZED_SENDERS = new Set(identitiesData.authorizedSenders.map((s) => s.id));
const AUTHORIZED_RECEIVERS = new Set(identitiesData.authorizedReceivers);
const ACTIVE_SESSIONS = new Set(
  sessionsData.sessions.filter((s) => s.status === "active").map((s) => s.sessionId)
);

export function evaluateContextGuard(packet: SignedTransactionPacket): ContextGuardResult {
  const { sender, receiver, sessionId } = packet.payload;
  const effectiveSessionId = packet.tamperedSessionId ?? sessionId;

  const isSenderValid = AUTHORIZED_SENDERS.has(sender);
  const isReceiverValid = AUTHORIZED_RECEIVERS.has(receiver);
  const isSessionValid = ACTIVE_SESSIONS.has(effectiveSessionId);

  const evidence: EvidenceItem[] = [
    {
      id: "ctx_sender_identity",
      label: "Sender Binding",
      status: isSenderValid ? "pass" : "fail",
      observed: sender,
      expected: "Registered Signer",
      description: isSenderValid
        ? "Sender identity bound to verified public certificate."
        : "Unrecognized or unauthorized transaction origin.",
    },
    {
      id: "ctx_receiver_identity",
      label: "Receiver Binding",
      status: isReceiverValid ? "pass" : "fail",
      observed: receiver,
      expected: "Recognized Recipient",
      description: isReceiverValid
        ? "Receiver is a registered target account."
        : "Target account not recognized by gateway policy.",
    },
    {
      id: "ctx_session_binding",
      label: "Session Validity",
      status: isSessionValid ? "pass" : "fail",
      observed: effectiveSessionId,
      expected: "Active Authorized Session",
      description: isSessionValid
        ? "Session token active and registered in gateway session state."
        : "Session expired, revoked, or altered context.",
    },
  ];

  const passed = isSenderValid && isReceiverValid && isSessionValid;
  let reason: string | undefined;

  if (!isSessionValid) {
    reason = `Session '${effectiveSessionId}' is revoked or not found in gateway active session registry.`;
  } else if (!isSenderValid) {
    reason = `Sender '${sender}' is not authorized to dispatch transactions.`;
  } else if (!isReceiverValid) {
    reason = `Receiver '${receiver}' is not a permitted recipient.`;
  }

  return {
    passed,
    reason,
    evidence,
  };
}
