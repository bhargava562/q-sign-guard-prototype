import React from "react";
import { ArrowLeftRight, ShieldAlert, Cpu } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";
import type { ActiveNavTab } from "../../types/transaction";

export const FloatingNav: React.FC = () => {
  const { activeTab, setActiveTab, auditEvents } = useSecurityStore();

  const navItems = [
    {
      id: "transactions" as ActiveNavTab,
      label: "Transactions",
      icon: ArrowLeftRight,
      badge: "Gateway Core",
    },
    {
      id: "events" as ActiveNavTab,
      label: "Security Events",
      icon: ShieldAlert,
      badge: auditEvents.length > 0 ? String(auditEvents.length) : null,
    },
    {
      id: "system" as ActiveNavTab,
      label: "System",
      icon: Cpu,
      badge: null,
    },
  ];

  return (
    <nav
      className="flex items-center justify-between border-b pb-3 pt-1 transition-all"
      style={{
        borderColor: "rgb(var(--border))",
      }}
      aria-label="Enclave operational navigation"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all duration-150 cursor-pointer ${
                isActive
                  ? "shadow-sm"
                  : "opacity-70 hover:opacity-100 hover:scale-[1.01]"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: "rgb(var(--surface))",
                      color: "rgb(var(--accent))",
                      border: "1px solid rgb(var(--border))",
                    }
                  : {
                      color: "rgb(var(--text-secondary))",
                    }
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-mono font-bold"
                  style={{
                    backgroundColor: isActive ? "rgb(var(--accent-soft))" : "rgb(var(--surface-muted))",
                    color: isActive ? "rgb(var(--accent))" : "rgb(var(--text-secondary))",
                    border: "1px solid rgb(var(--border))",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-caption">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>STRICT STATEFUL INVARIANTS · v1.0</span>
      </div>
    </nav>
  );
};
