# SprintMind

SprintMind is a multi-agent project assistant. It reads Jira issues and recommends task assignments. GitHub and Microsoft Teams are isolated connectors, so future agents can use them without changing Jira logic.

## Architecture

Jira / GitHub / Microsoft Teams -> connectors -> agents -> orchestrator

Current flow: JiraClient -> JiraTicketAgent -> TaskAssignmentAgent -> JSON project and recommendation output.

Planned next: Risk Analysis, a Teams connector, Project Assistant, and an Orchestrator.

## GitHub Actions setup

Store JIRA_API_TOKEN as a repository secret. Store JIRA_EMAIL, JIRA_BASE_URL, JIRA_PROJECT_KEY, and SPRINTMIND_TEAM as repository variables.

SPRINTMIND_TEAM must be a single-line JSON array. Example:

[{"id":"developer-a","displayName":"Developer A","capacity":3,"skills":["frontend","react"]},{"id":"developer-b","displayName":"Developer B","capacity":2,"skills":["backend","node"]}]

Use the Jira account ID as id when you later want SprintMind to write assignments. Capacity is the maximum number of simultaneous open tasks. Skills match Jira issue labels.

The Task Assignment Agent only recommends assignees for open, currently unassigned issues. It does not change Jira tickets.
