export type GatewayTraceStage =
  | "received"
  | "parsed"
  | "canonicalized"
  | "hashed"
  | "signature-verification"
  | "context-resolution"
  | "replay-check"
  | "execution-gate"
  | "committed"
  | "blocked";

export interface GatewayTraceEvent {
  id: string;
  stage: GatewayTraceStage;
  timestamp: string;
  operation: string;
  input?: string;
  output?: string;
  status: "running" | "success" | "failure";
  metadata?: Record<string, string>;
  rawSnippet?: string;
}

export interface GatewayPipelineNodeDef {
  id: GatewayTraceStage;
  label: string;
  subLabel: string;
  iconName: string;
  x: number; // percentage in graph
  y: number; // percentage in graph
}

export const GATEWAY_PIPELINE_NODES: {
  id: GatewayTraceStage;
  label: string;
  subLabel: string;
  stepNumber: number;
}[] = [
  { id: "received", label: "INGEST", subLabel: "Packet Ingress", stepNumber: 1 },
  { id: "parsed", label: "PARSE", subLabel: "Header Decoding", stepNumber: 2 },
  { id: "canonicalized", label: "CANONICALIZE", subLabel: "RFC 8785 JCS", stepNumber: 3 },
  { id: "hashed", label: "SHA-256", subLabel: "Context Digest", stepNumber: 4 },
  { id: "signature-verification", label: "ML-DSA-65", subLabel: "Signature Verifier", stepNumber: 5 },
  { id: "context-resolution", label: "CONTEXT", subLabel: "Session & Identity", stepNumber: 6 },
  { id: "replay-check", label: "REPLAY STORE", subLabel: "Nonce & Sequence", stepNumber: 7 },
  { id: "execution-gate", label: "GATE", subLabel: "Settlement Enclave", stepNumber: 8 },
];
