import React, { useState } from "react";
import { Activity, Radio } from "lucide-react";

export const ResearchMode: React.FC = () => {
  const [channelNoise, setChannelNoise] = useState(2.1); // QBER %

  const fidelity = Math.max(70, Math.round((100 - channelNoise * 2.2) * 10) / 10);
  const mismatch = Math.round((channelNoise * 1.25) * 10) / 10;
  const thresholdTa = 8.0; // Abort threshold %
  const thresholdTv = 11.0; // Verification threshold %

  const isDegraded = channelNoise > 5.0 && channelNoise <= thresholdTa;
  const isSuspicious = channelNoise > thresholdTa;

  // Generate SVG wave path points dynamically
  const wavePoints = Array.from({ length: 40 }, (_, i) => {
    const x = i * 20;
    const amplitude = (channelNoise / 14) * 25 + 5;
    const y = 50 + Math.sin((i + channelNoise) * 0.5) * amplitude;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="space-y-4">
      {/* Pedagogical Notice Banner */}
      <div
        className="rounded-2xl border p-4 sm:p-5 shadow-sm transition-all bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-transparent border-indigo-500/30"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 shadow-md shadow-indigo-500/20">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                RESEARCH TELEMETRY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 font-bold text-indigo-700 dark:text-indigo-300">
                Physical Link Layer
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mt-0.5">
              QDS / QKD Quantum Channel Telemetry Monitor
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              <strong>Key Finding:</strong> Replay traffic carries channel metrics identical to baseline traffic. Hence, <em>replay prevention is enforced via protocol nonces & sequence state</em>, while this telemetry module monitors fiber link integrity.
            </p>
          </div>
        </div>
      </div>

      {/* Live Oscilloscope Waveform Display */}
      <div
        className="rounded-2xl border p-4 sm:p-5 shadow-sm transition-all"
        style={{
          backgroundColor: "rgba(var(--surface), 0.95)",
          borderColor: "rgb(var(--border))",
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-500 animate-pulse" />
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Live Optical Channel Oscilloscope (Single Photon Waveform)
            </span>
          </div>

          <span
            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
              isSuspicious
                ? "bg-rose-500 text-white animate-pulse"
                : isDegraded
                ? "bg-amber-500 text-white"
                : "bg-emerald-500 text-white"
            }`}
          >
            {isSuspicious ? "ALERT: OPTICAL TAMPERING" : isDegraded ? "LINK DEGRADED" : "OPTICAL LINK NOMINAL"}
          </span>
        </div>

        {/* The Animated Waveform */}
        <div className="h-28 w-full rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
          
          <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 800 100">
            <polyline
              fill="none"
              stroke={isSuspicious ? "#f43f5e" : isDegraded ? "#f59e0b" : "#06b6d4"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={wavePoints}
            />
          </svg>

          <div className="absolute bottom-2 right-3 z-20 text-[10px] font-mono text-cyan-400">
            Sampling: 100 MHz • QBER: {channelNoise}%
          </div>
        </div>

        {/* Telemetry Gauge Cluster */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="rounded-xl border p-3.5 border-slate-200 dark:border-slate-800" style={{ backgroundColor: "rgb(var(--surface-muted))" }}>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">QBER Error Rate</span>
            <div className="text-2xl font-mono font-black mt-1 text-slate-900 dark:text-slate-100">{channelNoise}%</div>
            <span className="text-[10px] font-mono text-slate-500">Threshold Ta: {thresholdTa}%</span>
          </div>

          <div className="rounded-xl border p-3.5 border-slate-200 dark:border-slate-800" style={{ backgroundColor: "rgb(var(--surface-muted))" }}>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Quantum State Fidelity</span>
            <div className="text-2xl font-mono font-black mt-1 text-emerald-500">{fidelity}%</div>
            <span className="text-[10px] font-mono text-slate-500">Purity Target: &gt;90%</span>
          </div>

          <div className="rounded-xl border p-3.5 border-slate-200 dark:border-slate-800" style={{ backgroundColor: "rgb(var(--surface-muted))" }}>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Measurement Mismatch</span>
            <div className="text-2xl font-mono font-black mt-1 text-indigo-500">{mismatch}%</div>
            <span className="text-[10px] font-mono text-slate-500">Threshold Tv: {thresholdTv}%</span>
          </div>
        </div>

        {/* Slider */}
        <div className="mt-4 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800" style={{ backgroundColor: "rgb(var(--surface-subtle))" }}>
          <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
            <span>Simulate Channel Disturbance:</span>
            <span className="text-indigo-600 dark:text-indigo-400">{channelNoise}% QBER</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="14.0"
            step="0.1"
            value={channelNoise}
            onChange={(e) => setChannelNoise(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
