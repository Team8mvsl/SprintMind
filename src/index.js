import { loadConfig } from "./core/config.js";
import { JiraClient } from "./connectors/jira/jira-client.js";
import { JiraTicketAgent } from "./agents/ticket-agent.js";
import { TaskAssignmentAgent } from "./agents/task-assignment-agent.js";
import { AgentRegistry } from "./orchestrator/agent-registry.js";

async function main() {
  const config = loadConfig();
  const jira = new JiraClient(config.jira);
  const ticketAgent = new JiraTicketAgent(jira, config.jira.projectKey);
  const taskAssignmentAgent = new TaskAssignmentAgent();
  const registry = new AgentRegistry()
    .register("ticket-agent", ticketAgent)
    .register("task-assignment-agent", taskAssignmentAgent);
  const projectSnapshot = await registry.get("ticket-agent").getProjectSnapshot();
  const assignmentPlan = registry.get("task-assignment-agent").recommend(projectSnapshot, config.team);
  console.log(JSON.stringify({ projectSnapshot, assignmentPlan }, null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
