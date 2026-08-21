import { loadConfig } from "./core/config.js";
import { JiraClient } from "./connectors/jira/jira-client.js";
import { JiraTicketAgent } from "./agents/ticket-agent.js";
import { TaskAssignmentAgent } from "./agents/task-assignment-agent.js";
import { RiskAnalysisAgent } from "./agents/risk-analysis-agent.js";
import { ProjectAssistantAgent } from "./agents/project-assistant-agent.js";
import { SprintMindOrchestrator } from "./orchestrator/sprintmind-orchestrator.js";

async function main() {
  const config = loadConfig();
  const ticketAgent = new JiraTicketAgent(new JiraClient(config.jira), config.jira.projectKey);
  const orchestrator = new SprintMindOrchestrator({
    ticketAgent,
    taskAssignmentAgent: new TaskAssignmentAgent(),
    riskAnalysisAgent: new RiskAnalysisAgent(),
    projectAssistantAgent: new ProjectAssistantAgent()
  });
  console.log(JSON.stringify(await orchestrator.run(config.team), null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
