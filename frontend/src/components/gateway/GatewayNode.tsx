import React from "react";
import {
  Inbox,
  Code2,
  Layers,
  Hash,
  Cpu,
  ShieldCheck,
  Database,
  Send,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { GatewayTraceStage } from "../../types/gatewayTrace";

interface GatewayNodeProps {
  id: GatewayTraceStage;
  label: string;
  subLabel: string;
  stepNumber: number;
  isActive: boolean;
  status: "idle" | "running" | "success" | "failure";
}

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  received: Inbox,
  parsed: Code2,
  canonicalized: Layers,
  hashed: Hash,
  "signature-verification": Cpu,
  "context-resolution": ShieldCheck,
  "replay-check": Database,
  "execution-gate": Send,
  committed: Send,
  blocked: XCircle,
};

export const GatewayNode: React.FC<GatewayNodeProps> = ({
  id,
  label,
  subLabel,
  stepNumber,
  isActive,
  status,
}) => {
  const Icon = ICONS[id] || Layers;

  const isSuccess = status === "success";
  const isFailure = status === "failure";
  const isRunning = status === "running" || (isActive && !isSuccess && !isFailure);

  return (
    <div
      className={`relative rounded-2xl border p-3.5 sm:p-4 flex flex-col gap-2 transition-all duration-300 min-w-[130px] sm:min-w-[150px] shadow-sm ${
        isFailure
          ? "border-rose-500/80 bg-rose-500/10 text-rose-700 dark:text-rose-300 shadow-rose-500/15 ring-2 ring-rose-500/30"
          : isSuccess
          ? "border-emerald-500/70 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-emerald-500/15"
          : isRunning
          ? "border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300 shadow-sky-500/20 ring-2 ring-sky-400/40 animate-pulse"
          : "border-slate-200 dark:border-slate-800 bg-slate-500/5 text-caption opacity-60"
      }`}
    >
      {/* Node Step & Indicator */}
      <div className="flex items-center justify-between text-[10px] font-mono font-bold">
        <span className="flex items-center gap-1 opacity-75">
          <span>0{stepNumber}</span>
        </span>

        {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
        {isFailure && <XCircle className="w-3.5 h-3.5 text-rose-500 animate-bounce" />}
        {isRunning && (
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
        )}
      </div>

      {/* Title & Icon */}
      <div className="flex items-center gap-2">
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
            isFailure
              ? "bg-rose-500/20 text-rose-500"
              : isSuccess
              ? "bg-emerald-500/20 text-emerald-500"
              : isRunning
              ? "bg-sky-500/20 text-sky-500"
              : "bg-slate-500/10 text-caption"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-black tracking-tight text-heading truncate">
            {label}
          </span>
          <span className="text-[10px] font-mono text-caption truncate">
            {subLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
