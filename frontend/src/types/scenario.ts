import type { SignedTransactionPacket } from "./transaction";

export type ScenarioCategory = "BASELINE" | "ATTACKS" | "CONTEXT_ABUSE";

export interface AttackScenario {
  id: string;
  category: ScenarioCategory;
  name: string;
  badge: string;
  shortDescription: string;
  attackerIntent: string;
  attackerAction: string;
  expectedAuthenticity: "valid" | "invalid";
  expectedExecution: "authorized" | "blocked";
  expectedRule: string;
  whyExplanation: string;
  generatePacket: (basePacket: SignedTransactionPacket) => SignedTransactionPacket;
}
