# SprintMind

SprintMind is a multi-agent project assistant for Jira projects.

## Working architecture

Jira / GitHub / Microsoft Teams -> connectors -> agents -> orchestrator

The current workflow runs these agents in order:

1. Ticket Agent reads and normalizes SCRUM Jira issues.
2. Task Assignment Agent recommends an available team member for each open, unassigned task.
3. Risk Analysis Agent flags unassigned high-priority work, stale tasks, and capacity problems.
4. Project Assistant creates a concise project-health briefing.
5. SprintMind Orchestrator runs the agents and returns one structured result.

Microsoft Teams is ready as an isolated connector. It will post the Project Assistant briefing after a Teams webhook is configured.

## GitHub Actions setup

Store JIRA_API_TOKEN as a repository secret. Store JIRA_EMAIL, JIRA_BASE_URL, JIRA_PROJECT_KEY, and SPRINTMIND_TEAM as repository variables.

SPRINTMIND_TEAM must be a single-line JSON array. Example:

[{"id":"developer-a","displayName":"Developer A","capacity":3,"skills":["frontend","react"]},{"id":"developer-b","displayName":"Developer B","capacity":2,"skills":["backend","node"]}]

The Task Assignment Agent only recommends assignees. It does not change Jira tickets.
