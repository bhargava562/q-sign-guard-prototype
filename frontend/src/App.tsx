import { useEffect } from "react";
import { AppHeader } from "./components/shell/AppHeader";
import { FloatingNav } from "./components/shell/FloatingNav";
import { TransactionWorkspace } from "./components/transactions/TransactionWorkspace";
import { SecurityEventsLedger } from "./components/events/SecurityEventsLedger";
import { SystemEnclaveView } from "./components/system/SystemEnclaveView";
import { EvidenceSheet } from "./components/evidence/EvidenceSheet";
import { EnclaveLogin } from "./components/auth/EnclaveLogin";
import { useSecurityStore } from "./store/securityStore";

export function App() {
  const { theme, activeTab, isAuthenticated } = useSecurityStore();

  // Ensure theme class is applied on initial mount & toggle
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // When not logged in, present the enterprise enclave login demo
  if (!isAuthenticated) {
    return <EnclaveLogin />;
  }

  return (
    <div
      className="min-h-dvh flex flex-col transition-colors duration-200"
      style={{ backgroundColor: "rgb(var(--background))", color: "rgb(var(--foreground))" }}
    >
      {/* 1. Operational Enterprise Top Header */}
      <AppHeader />

      {/* 2. Main Operational Workspace */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col gap-4">
        {/* Navigation Tabs (Transactions dominant, Events, System) */}
        <FloatingNav />

        {/* Tab 1: Transactions (Overwhelmingly Dominant Protagonist) */}
        {activeTab === "transactions" && <TransactionWorkspace />}

        {/* Tab 2: Security Events (Operational Audit Ledger) */}
        {activeTab === "events" && <SecurityEventsLedger />}

        {/* Tab 3: System (Restrained Operational Status) */}
        {activeTab === "system" && <SystemEnclaveView />}
      </main>

      {/* Global Slide-over Evidence Drawer */}
      <EvidenceSheet />

      {/* 3. Operational Enterprise Footer */}
      <footer
        className="border-t py-3 text-center text-xs transition-colors mt-auto"
        style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--surface))" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium text-caption">
            <span className="font-semibold text-heading">Q-SignGuard Gateway Enclave</span>
            <span>•</span>
            <span className="font-mono text-[11px]">NIST FIPS 204 & RFC 8785 Protocol Architecture</span>
          </div>
          <div className="text-[11px] text-caption font-mono">
            Gateway Cluster: <span className="text-emerald-500 font-semibold">Active Enclave</span> (Simulated Pipeline Latency ~4.2ms)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
