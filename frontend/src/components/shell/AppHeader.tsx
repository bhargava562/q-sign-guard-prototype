import React from "react";
import { Shield, Sun, Moon, LogOut, User } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const AppHeader: React.FC = () => {
  const { theme, setTheme, currentUser, logout } = useSecurityStore();

  return (
    <header
      className="w-full border-b backdrop-blur-md sticky top-0 z-40 transition-colors"
      style={{
        backgroundColor: "rgba(var(--surface), 0.92)",
        borderColor: "rgb(var(--border))",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-transform"
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
                GATEWAY ENCLAVE
              </span>
            </div>
            <p className="text-xs text-caption hidden sm:block">
              Post-Quantum Transaction Security Gateway
            </p>
          </div>
        </div>

        {/* Gateway Status Badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono font-bold"
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
            <span>GATEWAY ONLINE</span>
          </div>

          {/* Operator Profile */}
          <div
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-[11px]">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-heading leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-caption font-mono">{currentUser.enclave}</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all hover:scale-105 cursor-pointer"
            style={{
              borderColor: "rgb(var(--border))",
              backgroundColor: "rgb(var(--surface-muted))",
              color: "rgb(var(--text-primary))",
            }}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-slate-700" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>

          {/* Lock / Exit Enclave */}
          <button
            type="button"
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 transition-all cursor-pointer"
            title="Lock Gateway / Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
