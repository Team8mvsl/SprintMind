const required = (name, value) => {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export function loadConfig(env = process.env) {
  return {
    jira: {
      baseUrl: required("JIRA_BASE_URL", env.JIRA_BASE_URL).replace(/\/$/, ""),
      email: required("JIRA_EMAIL", env.JIRA_EMAIL),
      apiToken: required("JIRA_API_TOKEN", env.JIRA_API_TOKEN),
      projectKey: required("JIRA_PROJECT_KEY", env.JIRA_PROJECT_KEY)
    },
    github: { token: env.GITHUB_TOKEN, repository: env.GITHUB_REPOSITORY },
    webex: { accessToken: env.WEBEX_ACCESS_TOKEN, roomId: env.WEBEX_ROOM_ID }
  };
}
