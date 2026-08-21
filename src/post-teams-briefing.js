import { readFile } from "node:fs/promises";
import { loadConfig } from "./core/config.js";
import { TeamsConnector } from "./connectors/teams/teams-connector.js";

const outputPath = process.argv[2];
if (!outputPath) throw new Error("Provide the SprintMind output file path.");

const result = JSON.parse(await readFile(outputPath, "utf8"));
const briefing = result.assistantBriefing;
const risks = result.riskReport.risks
  .filter((risk) => risk.level === "high")
  .map((risk) => "- " + risk.message)
  .join("\n");

const text = [
  "SprintMind project update",
  briefing.briefing,
  "Project health: " + briefing.projectHealth,
  risks ? "High-priority risks:\n" + risks : "No high-priority risks detected."
].join("\n\n");

await new TeamsConnector(loadConfig().teams).postText(text);
console.log("SprintMind briefing posted to Microsoft Teams.");
