import React, { useEffect, useRef } from "react";
import { Terminal, Check, X } from "lucide-react";
import type { GatewayTraceEvent } from "../../types/gatewayTrace";

interface GatewayTraceTerminalProps {
  events: GatewayTraceEvent[];
  activeEvent: GatewayTraceEvent | null;
}

export const GatewayTraceTerminal: React.FC<GatewayTraceTerminalProps> = ({
  events,
  activeEvent,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
      {/* Terminal Header Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-bold text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-teal-400" />
          <span>GATEWAY ENCLAVE TRACE LOGS</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
          <span>LIVE STREAM</span>
        </div>
      </div>

      {/* Terminal Log Output Body */}
      <div
        ref={scrollRef}
        className="p-4 overflow-y-auto max-h-56 flex flex-col gap-1.5 text-teal-400/90 leading-relaxed select-text"
        style={{ scrollBehavior: "smooth" }}
      >
        {events.map((evt) => {
          const isErr = evt.status === "failure";
          return (
            <div
              key={evt.id}
              className={`flex items-start gap-2 text-[11px] ${
                isErr ? "text-rose-400 font-bold" : "text-teal-300"
              }`}
            >
              <span className="text-slate-500 shrink-0">[{evt.timestamp}]</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-black shrink-0 ${
                  isErr
                    ? "bg-rose-950/80 text-rose-300 border border-rose-800/60"
                    : "bg-teal-950/80 text-teal-300 border border-teal-800/60"
                }`}
              >
                {evt.stage.toUpperCase().slice(0, 8)}
              </span>

              <span className="flex-1 break-all">{evt.operation}</span>

              {evt.status === "success" && (
                <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              )}
              {evt.status === "failure" && (
                <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              )}
            </div>
          );
        })}

        {activeEvent && (
          <div className="flex items-center gap-2 text-[11px] text-sky-400 animate-pulse pt-1">
            <span className="text-slate-500 shrink-0">[{activeEvent.timestamp}]</span>
            <span className="font-bold">EVALUATING &gt;</span>
            <span className="truncate">{activeEvent.operation}</span>
          </div>
        )}

        {events.length === 0 && (
          <span className="text-slate-600 italic text-xs">
            Awaiting ingress pipeline activation...
          </span>
        )}
      </div>
    </div>
  );
};
