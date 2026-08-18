import assert from "node:assert/strict";
import test from "node:test";
import { JiraTicketAgent } from "../src/agents/ticket-agent.js";

test("Ticket Agent normalizes a Jira issue into a portable task", async () => {
  const client = { async searchIssues() { return { total: 1, issues: [{
    id: "10100", key: "SCRUM-1", self: "https://example.atlassian.net/rest/api/3/issue/10100",
    fields: { summary: "Build Ticket Agent", description: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Read Jira tickets" }] }] }, issuetype: { name: "Task" }, status: { name: "To Do" }, priority: { name: "Medium" }, assignee: null, parent: null, created: "2026-08-18T00:00:00.000+0000", updated: "2026-08-18T00:00:00.000+0000" }
  }] }; } };
  const snapshot = await new JiraTicketAgent(client, "SCRUM").getProjectSnapshot();
  assert.equal(snapshot.projectKey, "SCRUM");
  assert.equal(snapshot.tasks[0].description, "Read Jira tickets");
  assert.equal(snapshot.tasks[0].key, "SCRUM-1");
});
