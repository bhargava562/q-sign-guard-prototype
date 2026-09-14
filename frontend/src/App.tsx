import { useEffect } from "react";
import { AppHeader } from "./components/shell/AppHeader";
import { FloatingNav } from "./components/shell/FloatingNav";
import { TransactionForm } from "./components/console/TransactionForm";
import { ContextBindingVisualizer } from "./components/console/ContextBindingVisualizer";
import { SecurityPipeline } from "./components/console/SecurityPipeline";
import { DecisionBanner } from "./components/console/DecisionBanner";
import { AttackLab } from "./components/attacks/AttackLab";
import { AuditTimeline } from "./components/evidence/AuditTimeline";
import { ResearchMode } from "./components/research/ResearchMode";
import { useSecurityStore } from "./store/securityStore";

export function App() {
  const { theme, activeTab } = useSecurityStore();

  // Ensure theme class is applied on initial mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-dvh flex flex-col transition-colors duration-200"
         style={{ backgroundColor: "rgb(var(--background))", color: "rgb(var(--foreground))" }}>
      {/* 1. Enterprise Top Header */}
      <AppHeader />

      {/* 2. Main Workspace */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col gap-4">
        {/* Floating Contextual Nav Pill */}
        <FloatingNav />

        {/* Tab 1: Gateway Console */}
        {activeTab === "console" && (
          <div className="space-y-4">
            {/* Desktop: 12-column grid. Col 1-4: Transaction Form (Zone A). Col 5-12: Security Pipeline (Zone B) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4">
                <TransactionForm />
              </div>
              <div className="lg:col-span-8 flex flex-col gap-4">
                <SecurityPipeline />
                <ContextBindingVisualizer />
              </div>
            </div>

            {/* Zone C: Decision & Evidence */}
            <DecisionBanner />
          </div>
        )}

        {/* Tab 2: Attack Laboratory */}
        {activeTab === "attacks" && (
          <div className="space-y-4">
            <AttackLab />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <SecurityPipeline />
              </div>
              <div className="lg:col-span-5">
                <DecisionBanner />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Audit & Evidence Log */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <AuditTimeline />
          </div>
        )}

        {/* Tab 4: Research Mode (Quantum Telemetry) */}
        {activeTab === "research" && (
          <div className="space-y-4">
            <ResearchMode />
          </div>
        )}
      </main>

      {/* 3. Operational Enterprise Footer */}
      <footer className="border-t py-3 text-center text-xs transition-colors"
              style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--surface))" }}>
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium text-caption">
            <span className="font-semibold text-heading">Q-SignGuard Gateway Console</span>
            <span>•</span>
            <span className="font-mono text-[11px]">NIST FIPS 204 & RFC 8785 Protocol Specification</span>
          </div>
          <div className="text-[11px] text-caption font-mono">
            Gateway Cluster: <span className="text-emerald-500 font-semibold">Active Enclave</span> (0.5ms sync)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
