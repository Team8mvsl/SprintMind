import assert from "node:assert/strict";
import test from "node:test";
import { TaskAssignmentAgent } from "../src/agents/task-assignment-agent.js";

test("Task Assignment Agent favours free capacity and matching skills", () => {
  const snapshot = {
    tasks: [
      { key: "SCRUM-1", title: "Create login page", status: "To Do", labels: ["frontend"], assignee: null },
      { key: "SCRUM-2", title: "Existing API task", status: "In Progress", labels: ["backend"], assignee: { accountId: "dev-b", displayName: "Developer B" } }
    ]
  };
  const team = [
    { id: "dev-a", displayName: "Developer A", capacity: 3, skills: ["frontend"] },
    { id: "dev-b", displayName: "Developer B", capacity: 3, skills: ["backend"] }
  ];
  const plan = new TaskAssignmentAgent().recommend(snapshot, team);
  assert.equal(plan.recommendations[0].recommendation.memberId, "dev-a");
  assert.equal(plan.recommendations[0].taskKey, "SCRUM-1");
});
