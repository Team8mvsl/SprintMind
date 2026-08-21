const required = (name, value) => {
  if (!value) throw new Error("Missing required environment variable: " + name);
  return value;
};

function loadTeam(value) {
  if (!value) return [];
  try {
    const team = JSON.parse(value);
    if (!Array.isArray(team)) throw new Error("must be a JSON array");
    return team.map((member) => ({
      id: required("SPRINTMIND_TEAM[].id", member.id),
      displayName: required("SPRINTMIND_TEAM[].displayName", member.displayName),
      capacity: Number.isFinite(member.capacity) ? member.capacity : 3,
      skills: Array.isArray(member.skills) ? member.skills : []
    }));
  } catch (error) {
    throw new Error("Invalid SPRINTMIND_TEAM: " + error.message);
  }
}

export function loadConfig(env = process.env) {
  return {
    jira: {
      baseUrl: required("JIRA_BASE_URL", env.JIRA_BASE_URL).replace(/\/$/, ""),
      email: required("JIRA_EMAIL", env.JIRA_EMAIL),
      apiToken: required("JIRA_API_TOKEN", env.JIRA_API_TOKEN),
      projectKey: required("JIRA_PROJECT_KEY", env.JIRA_PROJECT_KEY)
    },
    team: loadTeam(env.SPRINTMIND_TEAM),
    github: { token: env.GITHUB_TOKEN, repository: env.GITHUB_REPOSITORY },
    teams: { webhookUrl: env.TEAMS_WEBHOOK_URL }
  };
}
