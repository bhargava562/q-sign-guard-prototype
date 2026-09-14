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
    <div className="space-y-5">
      {/* Before / After visual comparison at the top */}
      <BeforeAfterDiff />

      {/* Attack Scenario Selector Grid */}
      <div
        className="rounded-2xl border p-4 sm:p-5 shadow-sm transition-all"
        style={{
          backgroundColor: "rgb(var(--surface))",
          borderColor: "rgb(var(--border))",
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: "rgb(var(--border))" }}>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span>INTERACTIVE ATTACK SIMULATION LABORATORY</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                1 Baseline + 5 Exploits
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an attack vector to simulate adversarial modification and watch the gateway enforce deterministic boundaries.
            </p>
          </div>

          <button
            type="button"
            onClick={resetReplayStore}
            disabled={isProcessing}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--foreground))" }}
            title="Reset in-memory replay cache to baseline state"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Cache</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {ATTACK_SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;
            const isHero = scenario.id === "replay_attack";
            const isBaseline = scenario.category === "BASELINE";

            return (
              <div
                key={scenario.id}
                onClick={() => selectScenario(scenario.id)}
                className={`cursor-pointer rounded-xl border p-3.5 flex flex-col justify-between transition-all duration-150 ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-md"
                    : "hover:border-slate-400 dark:hover:border-slate-600"
                }`}
                style={{
                  backgroundColor: isSelected
                    ? "rgb(var(--surface-muted))"
                    : "rgb(var(--surface))",
                  borderColor: isHero
                    ? "rgb(var(--danger) / 0.5)"
                    : isBaseline
                    ? "rgb(var(--success) / 0.4)"
                    : "rgb(var(--border))",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isHero
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : isBaseline
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {scenario.badge}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400">
                      {scenario.expectedExecution === "authorized" ? "EXPECTS ALLOW" : "EXPECTS BLOCK"}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {scenario.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {scenario.shortDescription}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t flex items-center justify-between" style={{ borderColor: "rgb(var(--border))" }}>
                  <div className="text-[10px] font-mono text-slate-500">
                    Rule: <span className="font-semibold text-slate-700 dark:text-slate-300">{scenario.expectedRule}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunch(scenario.id);
                    }}
                    disabled={isProcessing}
                    className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg text-white transition-all ${
                      isHero
                        ? "bg-rose-600 hover:bg-rose-700"
                        : isBaseline
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } disabled:opacity-50`}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b mb-3" style={{ borderColor: "rgb(var(--border))" }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase text-blue-600 dark:text-blue-400">
                  Scenario Focus:
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {selectedScenario.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Expected:</span>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  Auth: {selectedScenario.expectedAuthenticity.toUpperCase()}
                </span>
                <span className="text-slate-300">•</span>
                <span className={`text-xs font-mono font-bold ${selectedScenario.expectedExecution === "authorized" ? "text-emerald-600" : "text-rose-600"}`}>
                  Exec: {selectedScenario.expectedExecution.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Attacker Intent:
                </span>
                <p className="text-slate-500 leading-relaxed">
                  {selectedScenario.attackerIntent}
                </p>
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Adversarial Manipulation:
                </span>
                <p className="text-slate-500 leading-relaxed">
                  {selectedScenario.attackerAction}
                </p>
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Why Gateway Blocks/Allows:
                </span>
                <p className="text-slate-500 leading-relaxed">
                  {selectedScenario.whyExplanation}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t flex justify-end" style={{ borderColor: "rgb(var(--border))" }}>
              <button
                type="button"
                onClick={() => handleLaunch(selectedScenario.id)}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all"
                style={{ backgroundColor: "rgb(var(--accent))" }}
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
