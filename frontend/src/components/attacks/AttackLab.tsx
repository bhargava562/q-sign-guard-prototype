import React from "react";
import { ShieldAlert, Play, RotateCcw } from "lucide-react";
import { useSecurityStore } from "../../store/securityStore";
import { ATTACK_SCENARIOS } from "../../data/scenarios";
import { BeforeAfterDiff } from "./BeforeAfterDiff";

export const AttackLab: React.FC = () => {
  const {
    selectedScenarioId,
    selectScenario,
    launchScenario,
    isProcessing,
    resetReplayStore,
  } = useSecurityStore();

  const selectedScenario =
    ATTACK_SCENARIOS.find((s) => s.id === selectedScenarioId) ?? ATTACK_SCENARIOS[1];

  const handleLaunch = async (scenarioId: string) => {
    selectScenario(scenarioId);
    await launchScenario(scenarioId);
  };

  return (
    <div className="space-y-4">
      {/* Before / After visual comparison at the top */}
      <BeforeAfterDiff />

      {/* Attack Scenario Selector Grid */}
      <div
        className="rounded-2xl border p-4 sm:p-5 shadow-sm transition-all card-panel"
      >
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: "rgb(var(--border))" }}>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-heading flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span>ATTACK SIMULATION LABORATORY</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: "rgb(var(--surface-muted))",
                      color: "rgb(var(--text-secondary))",
                    }}>
                1 Baseline + 5 Exploits
              </span>
            </h3>
            <p className="text-xs text-caption mt-0.5">
              Select an attack vector to simulate adversarial modification.
            </p>
          </div>

          <button
            type="button"
            onClick={resetReplayStore}
            disabled={isProcessing}
            className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border hover:scale-105 transition-all"
            style={{
              borderColor: "rgb(var(--border))",
              color: "rgb(var(--text-primary))",
              backgroundColor: "rgb(var(--surface-muted))",
            }}
            title="Reset in-memory replay cache to baseline state"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Cache</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ATTACK_SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;
            const isHero = scenario.id === "replay_attack";
            const isBaseline = scenario.category === "BASELINE";

            return (
              <div
                key={scenario.id}
                onClick={() => selectScenario(scenario.id)}
                className={`cursor-pointer rounded-2xl border p-4 flex flex-col justify-between transition-all duration-150 ${
                  isSelected
                    ? "ring-2 ring-indigo-500 shadow-md scale-[1.01]"
                    : "hover:border-slate-400 dark:hover:border-slate-600"
                }`}
                style={{
                  backgroundColor: isSelected
                    ? "rgb(var(--surface-elevated))"
                    : "rgb(var(--surface-muted))",
                  borderColor: isHero
                    ? "rgba(var(--danger), 0.5)"
                    : isBaseline
                    ? "rgba(var(--success), 0.5)"
                    : "rgb(var(--border))",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                        isHero
                          ? "bg-rose-500/20 text-rose-500"
                          : isBaseline
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-indigo-500/20 text-indigo-400"
                      }`}
                    >
                      {scenario.badge}
                    </span>

                    <span className="text-[10px] font-mono font-bold text-caption">
                      {scenario.expectedExecution === "authorized" ? "ALLOW" : "BLOCK"}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-heading uppercase tracking-wide">
                    {scenario.name}
                  </h4>
                  <p className="text-[11px] text-body mt-1 leading-snug">
                    {scenario.shortDescription}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t flex items-center justify-between" style={{ borderColor: "rgb(var(--border))" }}>
                  <div className="text-[10px] font-mono text-caption">
                    Rule: <span className="font-bold text-heading">{scenario.expectedRule}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunch(scenario.id);
                    }}
                    disabled={isProcessing}
                    className={`flex items-center gap-1 text-[11px] font-mono font-black px-3 py-1 rounded-lg text-white transition-all ${
                      isHero
                        ? "bg-rose-600 hover:bg-rose-500"
                        : isBaseline
                        ? "bg-emerald-600 hover:bg-emerald-500"
                        : "bg-indigo-600 hover:bg-indigo-500"
                    } disabled:opacity-50 shadow-sm`}
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Scenario Deep Dive Card */}
        {selectedScenario && (
          <div
            className="mt-4 rounded-xl border p-4 transition-all"
            style={{
              backgroundColor: "rgb(var(--surface-muted))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b mb-3" style={{ borderColor: "rgb(var(--border))" }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black uppercase text-indigo-400">
                  Scenario Focus:
                </span>
                <span className="text-xs font-black text-heading uppercase">
                  {selectedScenario.name}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-caption">Expected:</span>
                <span className="font-bold text-emerald-500">
                  Auth: {selectedScenario.expectedAuthenticity.toUpperCase()}
                </span>
                <span className="text-caption">•</span>
                <span className={`font-bold ${selectedScenario.expectedExecution === "authorized" ? "text-emerald-500" : "text-rose-500"}`}>
                  Exec: {selectedScenario.expectedExecution.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="font-bold text-heading block mb-0.5">
                  Attacker Intent:
                </span>
                <p className="text-body leading-relaxed">
                  {selectedScenario.attackerIntent}
                </p>
              </div>
              <div>
                <span className="font-bold text-heading block mb-0.5">
                  Adversarial Manipulation:
                </span>
                <p className="text-body leading-relaxed">
                  {selectedScenario.attackerAction}
                </p>
              </div>
              <div>
                <span className="font-bold text-heading block mb-0.5">
                  Why Gateway Blocks/Allows:
                </span>
                <p className="text-body leading-relaxed">
                  {selectedScenario.whyExplanation}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t flex justify-end" style={{ borderColor: "rgb(var(--border))" }}>
              <button
                type="button"
                onClick={() => handleLaunch(selectedScenario.id)}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white shadow-md bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-95 transition-all"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Simulate Scenario in Pipeline</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
