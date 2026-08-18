import { loadConfig } from "./core/config.js";
import { JiraClient } from "./connectors/jira/jira-client.js";
import { JiraTicketAgent } from "./agents/ticket-agent.js";
import { AgentRegistry } from "./orchestrator/agent-registry.js";

async function main() {
  const config = loadConfig();
  const jira = new JiraClient(config.jira);
  const ticketAgent = new JiraTicketAgent(jira, config.jira.projectKey);
  const registry = new AgentRegistry().register("ticket-agent", ticketAgent);
  const snapshot = await registry.get("ticket-agent").getProjectSnapshot();
  console.log(JSON.stringify(snapshot, null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
