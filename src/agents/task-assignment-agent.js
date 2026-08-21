const completedStatuses = new Set(["done", "closed", "resolved", "complete", "completed"]);

function isComplete(task) {
  return completedStatuses.has(String(task.status).trim().toLowerCase());
}

function memberOwnsTask(member, task) {
  if (!task.assignee) return false;
  return task.assignee.accountId === member.id || task.assignee.displayName === member.displayName;
}

function skillScore(member, task) {
  const skills = new Set(member.skills.map((skill) => skill.toLowerCase()));
  return (task.labels ?? []).reduce((score, label) => score + (skills.has(label.toLowerCase()) ? 5 : 0), 0);
}

export class TaskAssignmentAgent {
  recommend(projectSnapshot, team) {
    const activeTasks = projectSnapshot.tasks.filter((task) => !isComplete(task));
    const workload = team.map((member) => ({
      ...member,
      activeTasks: activeTasks.filter((task) => memberOwnsTask(member, task)).length
    }));

    if (workload.length === 0) {
      return {
        source: "task-assignment-agent",
        message: "No team is configured. Add the SPRINTMIND_TEAM repository variable to receive recommendations.",
        recommendations: [],
        teamWorkload: []
      };
    }

    const recommendations = activeTasks
      .filter((task) => !task.assignee)
      .map((task) => {
        const candidates = workload
          .filter((member) => member.activeTasks < member.capacity)
          .map((member) => ({
            ...member,
            score: (member.capacity - member.activeTasks) * 10 + skillScore(member, task)
          }))
          .sort((left, right) => right.score - left.score || left.activeTasks - right.activeTasks);

        if (candidates.length === 0) {
          return {
            taskKey: task.key,
            taskTitle: task.title,
            recommendation: null,
            reason: "No team member has capacity for another active task."
          };
        }

        const selected = candidates[0];
        selected.activeTasks += 1;
        return {
          taskKey: task.key,
          taskTitle: task.title,
          recommendation: { memberId: selected.id, displayName: selected.displayName },
          reason: "Selected for available capacity" + (skillScore(selected, task) ? " and matching Jira labels." : ".")
        };
      });

    return {
      source: "task-assignment-agent",
      message: "Recommendations only. Jira issues are not changed.",
      recommendations,
      teamWorkload: workload.map(({ id, displayName, activeTasks, capacity }) => ({ id, displayName, activeTasks, capacity }))
    };
  }
}
