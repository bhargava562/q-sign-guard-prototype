import React from "react";
import { ShieldCheck, BookOpen, Clock } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";
import type { ActiveNavTab } from "../../types/transaction";

export const FloatingNav: React.FC = () => {
  const { activeTab, setActiveTab, auditEvents } = useSecurityStore();

  const navItems = [
    {
      id: "protect" as ActiveNavTab,
      label: "Protect",
      icon: ShieldCheck,
      badge: null,
    },
    {
      id: "learn" as ActiveNavTab,
      label: "Learn",
      icon: BookOpen,
      badge: "Architecture",
    },
    {
      id: "activity" as ActiveNavTab,
      label: "Activity",
      icon: Clock,
      badge: auditEvents.length > 0 ? String(auditEvents.length) : null,
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
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-150 ${
                isActive ? "shadow-sm" : "hover:scale-102"
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
                    backgroundColor: isActive ? "rgb(var(--accent-soft))" : "rgb(var(--surface))",
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
    </nav>
  );
};
