import React from "react";
import { Terminal, ShieldAlert, FileText, Cpu } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";

export const FloatingNav: React.FC = () => {
  const { activeTab, setActiveTab, auditEvents } = useSecurityStore();

  const navItems = [
    {
      id: "console" as const,
      label: "Gateway Console",
      icon: Terminal,
      badge: null,
    },
    {
      id: "attacks" as const,
      label: "Attack Lab",
      icon: ShieldAlert,
      badge: "6 Scenarios",
    },
    {
      id: "audit" as const,
      label: "Audit & Evidence",
      icon: FileText,
      badge: auditEvents.length > 0 ? String(auditEvents.length) : null,
    },
    {
      id: "research" as const,
      label: "Research Telemetry",
      icon: Cpu,
      badge: "QDS",
    },
  ];

  return (
    <nav
      className="flex items-center justify-center p-1.5 rounded-2xl shadow-sm border backdrop-blur-md mx-auto max-w-fit transition-all"
      style={{
        backgroundColor: "rgba(var(--surface-muted), 0.9)",
        borderColor: "rgb(var(--border))",
      }}
      aria-label="Navigation switcher"
    >
      <div className="flex items-center gap-1 sm:gap-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-150 ${
                isActive
                  ? "shadow-sm"
                  : "hover:scale-102"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: "rgb(var(--surface))",
                      color: "rgb(var(--accent))",
                      border: "1px solid rgb(var(--border-strong))",
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
                  className="rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold"
                  style={{
                    backgroundColor: isActive
                      ? "rgb(var(--accent-soft))"
                      : "rgb(var(--surface))",
                    color: isActive ? "rgb(var(--accent))" : "rgb(var(--text-primary))",
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
    </nav>
  );
};
