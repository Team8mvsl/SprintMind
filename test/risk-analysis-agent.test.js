import assert from "node:assert/strict";
import test from "node:test";
import { RiskAnalysisAgent } from "../src/agents/risk-analysis-agent.js";

test("Risk Analysis Agent flags unassigned high-priority work", () => {
  const snapshot = {
    tasks: [{ key: "SCRUM-9", status: "To Do", priority: "High", assignee: null, updatedAt: "2026-08-20T00:00:00.000Z" }]
  };
  const report = new RiskAnalysisAgent().analyze(snapshot, { recommendations: [], teamWorkload: [] }, new Date("2026-08-21T00:00:00.000Z"));
  assert.equal(report.risks[0].type, "unassigned-priority-work");
});
