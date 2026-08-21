const completedStatuses = new Set(["done", "closed", "resolved", "complete", "completed"]);

export class ProjectAssistantAgent {
  summarize(projectSnapshot, assignmentPlan, riskReport) {
    const tasks = projectSnapshot.tasks;
    const completed = tasks.filter((task) => completedStatuses.has(String(task.status).trim().toLowerCase())).length;
    const open = tasks.length - completed;
    const unassigned = tasks.filter((task) => !task.assignee && !completedStatuses.has(String(task.status).trim().toLowerCase())).length;
    const highRisks = riskReport.risks.filter((risk) => risk.level === "high").length;

    return {
      source: "project-assistant-agent",
      projectHealth: highRisks > 0 ? "needs-attention" : "on-track",
      metrics: {
        totalTasks: tasks.length,
        openTasks: open,
        completedTasks: completed,
        unassignedOpenTasks: unassigned,
        recommendationCount: assignmentPlan.recommendations.length,
        riskCount: riskReport.riskCount
      },
      briefing: "SprintMind found " + open + " open task(s), " + unassigned + " unassigned open task(s), and " + riskReport.riskCount + " risk(s)."
    };
  }
}
