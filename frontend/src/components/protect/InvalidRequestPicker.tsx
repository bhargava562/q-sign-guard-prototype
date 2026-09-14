import React from "react";
import { X, ShieldAlert, ArrowRight } from "lucide-react";
import { INVALID_REQUEST_SCENARIOS } from "../../data/incomingRequests";
import { useSecurityStore } from "../../store/securityStore";

interface Props {
  onClose: () => void;
}

export const InvalidRequestPicker: React.FC<Props> = ({ onClose }) => {
  const { testInvalidScenario, isProcessing } = useSecurityStore();

  const handleSelect = async (id: string) => {
    onClose();
    await testInvalidScenario(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl border p-6 shadow-2xl card-panel relative bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-heading">Test Another Invalid Request</h3>
              <p className="text-xs text-caption">Observe how Q-SignGuard enforces each protocol invariant</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-caption hover:text-heading hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scenarios List */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {INVALID_REQUEST_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSelect(scenario.id)}
              className="w-full text-left p-4 rounded-2xl border transition-all hover:scale-[1.01] hover:border-indigo-500/50 bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/60 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-heading block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {scenario.title}
                  </span>
                  <p className="text-xs text-caption mt-1 leading-relaxed">{scenario.description}</p>
                  <span className="inline-block text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-2">
                    Invariant: {scenario.expectedInvariant}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-caption group-hover:text-indigo-500 transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
