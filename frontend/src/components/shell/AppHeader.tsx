import React from "react";
import { Shield, Sun, Moon, Zap, Activity } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const AppHeader: React.FC = () => {
  const { theme, setTheme, reducedMotion, setReducedMotion } =
    useSecurityStore();

  return (
    <header
      className="w-full border-b backdrop-blur-md sticky top-0 z-40 transition-colors"
      style={{
        backgroundColor: "rgba(var(--surface), 0.85)",
        borderColor: "rgb(var(--border))",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-transform hover:scale-105"
            style={{
              backgroundColor: "rgb(var(--accent-soft))",
              color: "rgb(var(--accent))",
              border: "1px solid rgb(var(--accent) / 0.3)",
            }}
          >
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Q-SIGNGUARD
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
                style={{
                  backgroundColor: "rgb(var(--info-soft))",
                  color: "rgb(var(--info))",
                  border: "1px solid rgb(var(--info) / 0.25)",
                }}
                title="Interactive client simulation of ML-DSA & Context-Aware Replay Gateway"
              >
                DEMO MODE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Protocol-Aware Security Gateway for Post-Quantum Signatures
            </p>
          </div>
        </div>

        {/* Central Invariant Ticker */}
        <div
          className="hidden md:flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium"
          style={{
            backgroundColor: "rgb(var(--surface-muted))",
            color: "rgb(var(--foreground))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Authenticity</span>
          <span className="text-slate-400">proves origin</span>
          <span className="text-slate-400">•</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Context</span>
          <span className="text-slate-400">proves execution validity</span>
        </div>

        {/* Status indicator and actions */}
        <div className="flex items-center gap-2.5">
          {/* Gateway Health Indicator */}
          <div
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium"
            style={{
              backgroundColor: "rgb(var(--success-soft))",
              color: "rgb(var(--success))",
              border: "1px solid rgb(var(--success) / 0.2)",
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
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs transition-all ${
              reducedMotion
                ? "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
            title={reducedMotion ? "Motion: Reduced" : "Motion: Normal"}
            aria-label="Toggle reduced motion"
          >
            <Activity className="h-4 w-4" />
          </button>

          {/* Theme Toggle (Light default / Dark toggle) */}
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
            style={{
              borderColor: "rgb(var(--border))",
              backgroundColor: "rgb(var(--surface))",
              color: "rgb(var(--foreground))",
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
