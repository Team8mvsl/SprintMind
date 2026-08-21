function textFromAdf(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  const visit = (node) => [node.text, ...(node.content ?? []).flatMap(visit)].filter(Boolean).join(" ");
  return visit(value).replace(/\s+/g, " ").trim() || null;
}

export class JiraTicketAgent {
  constructor(jiraClient, projectKey) { this.jiraClient = jiraClient; this.projectKey = projectKey; }
  async getProjectSnapshot() {
    const response = await this.jiraClient.searchIssues("project = " + this.projectKey + " ORDER BY updated DESC");
    const tasks = response.issues.map((issue) => this.toTask(issue));
    return { source: "jira", projectKey: this.projectKey, retrievedAt: new Date().toISOString(), totalIssues: response.total ?? tasks.length, tasks };
  }
  toTask(issue) {
    const fields = issue.fields;
    return {
      id: issue.id, key: issue.key, title: fields.summary, description: textFromAdf(fields.description),
      type: fields.issuetype?.name ?? "Unknown", status: fields.status?.name ?? "Unknown", priority: fields.priority?.name ?? null,
      labels: fields.labels ?? [],
      assignee: fields.assignee ? { accountId: fields.assignee.accountId, displayName: fields.assignee.displayName } : null,
      parentKey: fields.parent?.key ?? null, createdAt: fields.created, updatedAt: fields.updated, url: issue.self
    };
  }
}
