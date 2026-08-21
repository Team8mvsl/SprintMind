const completedStatuses = new Set(["done", "closed", "resolved", "complete", "completed"]);
const urgentPriorities = new Set(["highest", "high"]);

function isComplete(task) {
  return completedStatuses.has(String(task.status).trim().toLowerCase());
}

export class RiskAnalysisAgent {
  constructor({ staleAfterDays = 7 } = {}) {
    this.staleAfterDays = staleAfterDays;
  }

  analyze(projectSnapshot, assignmentPlan, now = new Date()) {
    const risks = [];
    const activeTasks = projectSnapshot.tasks.filter((task) => !isComplete(task));

    for (const task of activeTasks) {
      if (!task.assignee && urgentPriorities.has(String(task.priority).toLowerCase())) {
        risks.push({
          level: "high",
          type: "unassigned-priority-work",
          taskKey: task.key,
          message: task.key + " is " + task.priority + " priority and has no assignee."
        });
      }

      const updatedAt = new Date(task.updatedAt);
      const ageInDays = (now - updatedAt) / 86400000;
      if (task.updatedAt && Number.isFinite(ageInDays) && ageInDays > this.staleAfterDays) {
        risks.push({
          level: "medium",
          type: "stale-work",
          taskKey: task.key,
          message: task.key + " has not been updated for " + Math.floor(ageInDays) + " days."
        });
      }
    }

    for (const recommendation of assignmentPlan.recommendations ?? []) {
      if (!recommendation.recommendation) {
        risks.push({
          level: "high",
          type: "no-capacity",
          taskKey: recommendation.taskKey,
          message: recommendation.taskKey + " cannot be assigned because the configured team has no available capacity."
        });
      }
    }

    for (const member of assignmentPlan.teamWorkload ?? []) {
      if (member.activeTasks > member.capacity) {
        risks.push({
          level: "high",
          type: "over-capacity",
          memberId: member.id,
          message: member.displayName + " has " + member.activeTasks + " tasks, above their capacity of " + member.capacity + "."
        });
      }
    }

    return {
      source: "risk-analysis-agent",
      riskCount: risks.length,
      risks
    };
  }
}
