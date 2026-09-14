import React from "react";
import { Shield, Sun, Moon, Activity } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const AppHeader: React.FC = () => {
  const { theme, setTheme, reducedMotion, setReducedMotion } = useSecurityStore();

  return (
    <header
      className="w-full border-b backdrop-blur-md sticky top-0 z-40 transition-colors"
      style={{
        backgroundColor: "rgba(var(--surface), 0.9)",
        borderColor: "rgb(var(--border))",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md transition-transform hover:scale-105"
            style={{
              backgroundColor: "rgb(var(--accent-soft))",
              color: "rgb(var(--accent))",
              border: "1px solid rgb(var(--accent) / 0.4)",
            }}
          >
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-heading">
                Q-SIGNGUARD
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase"
                style={{
                  backgroundColor: "rgb(var(--cyan-soft))",
                  color: "rgb(var(--cyan))",
                  border: "1px solid rgb(var(--cyan) / 0.4)",
                }}
              >
                ENTERPRISE GATEWAY
              </span>
            </div>
            <p className="text-xs text-caption hidden sm:block">
              Post-Quantum Transaction Security Enclave
            </p>
          </div>
        </div>

        {/* Operational Security Enclave Telemetry (No Presentation Proverbs) */}
        <div
          className="hidden md:flex items-center gap-3 rounded-full px-3.5 py-1.5 text-[11px] font-mono"
          style={{
            backgroundColor: "rgb(var(--surface-muted))",
            color: "rgb(var(--text-secondary))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-heading">CIPHER:</span>
            <span>ML-DSA-65</span>
          </div>
          <span className="text-caption">|</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-heading">CANONICAL:</span>
            <span>RFC 8785</span>
          </div>
          <span className="text-caption">|</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-heading">DEFENSE:</span>
            <span className="text-emerald-500 font-bold">STATEFUL INVARIANT</span>
          </div>
        </div>

        {/* Status indicator and actions */}
        <div className="flex items-center gap-2.5">
          {/* Gateway Health Indicator */}
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono font-bold"
            style={{
              backgroundColor: "rgb(var(--success-soft))",
              color: "rgb(var(--success))",
              border: "1px solid rgb(var(--success) / 0.3)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden lg:inline">GATEWAY ONLINE</span>
          </div>

          {/* Reduced Motion Toggle */}
          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs transition-all ${
              reducedMotion
                ? "bg-amber-500/10 text-amber-500 border-amber-500/40"
                : "border-slate-300 dark:border-slate-700 text-caption hover:border-slate-400"
            }`}
            title={reducedMotion ? "Motion: Reduced" : "Motion: Normal"}
            aria-label="Toggle reduced motion"
          >
            <Activity className="h-4 w-4" />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all hover:scale-105"
            style={{
              borderColor: "rgb(var(--border))",
              backgroundColor: "rgb(var(--surface-muted))",
              color: "rgb(var(--text-primary))",
            }}
            title={theme === "light" ? "Switch to Dark Console Mode" : "Switch to Light Mode"}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-slate-700" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
