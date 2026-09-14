import React, { useState } from "react";
import { Shield, KeyRound, Lock, ArrowRight, Server, CheckCircle2, Cpu } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const EnclaveLogin: React.FC = () => {
  const { loginDemo, currentUser } = useSecurityStore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      loginDemo();
    }, 450);
  };

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 transition-colors relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
      }}
    >
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-15 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(14,165,233,0.3),rgba(255,255,255,0))]" />

      <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
        {/* Gateway Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-500 shadow-lg shadow-sky-500/10">
            <Shield className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div className="space-y-1 mt-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-heading">
              Q-SIGNGUARD
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-caption tracking-wide uppercase">
              Post-Quantum Transaction Security Gateway
            </p>
          </div>
        </div>

        {/* Enclave Authentication Box */}
        <div
          className="rounded-2xl border p-6 sm:p-7 shadow-xl backdrop-blur-md flex flex-col gap-6"
          style={{
            backgroundColor: "rgb(var(--surface))",
            borderColor: "rgb(var(--border))",
          }}
        >
          <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-mono font-bold tracking-wider text-heading uppercase">
                Gateway Cluster Enclave
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>

          {/* Operator Profile Preview */}
          <div
            className="p-4 rounded-xl border flex flex-col gap-3"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-caption">Operator Identity</span>
              <span className="font-mono text-[11px] font-bold text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                VERIFIED ENCLAVE KEY
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-base border border-sky-500/20">
                AM
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-heading leading-snug">
                  {currentUser.name}
                </span>
                <span className="text-xs font-mono text-caption">
                  {currentUser.email}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t flex flex-col gap-1.5 text-[11px] font-mono text-caption" style={{ borderColor: "rgb(var(--border))" }}>
              <div className="flex items-center justify-between">
                <span>Role:</span>
                <span className="font-semibold text-body">{currentUser.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Enclave:</span>
                <span className="font-semibold text-body">{currentUser.enclave}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Provider:</span>
                <span className="font-semibold text-body">ML-DSA-65 (FIPS 204)</span>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={isAuthenticating}
            className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAuthenticating ? (
              <>
                <Cpu className="w-4 h-4 animate-spin text-white" />
                <span>Initializing Secure Session...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Authenticate & Enter Gateway</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          {/* Security Guarantee Pills */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-caption font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Strict Invariant Policy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>Stateful Replay Store</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-caption">
          Q-SignGuard Transaction Execution Security Gateway · Operator Enclave v1.0
        </p>
      </div>
    </div>
  );
};
