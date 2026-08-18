# SprintMind

SprintMind is a multi-agent project assistant. Its first working capability is a Jira Ticket Agent that turns Jira issues into a consistent project snapshot. GitHub and Webex are deliberately isolated connectors so future agents can use them without changing Jira logic.

## Architecture

`Jira / GitHub / Webex -> connectors -> agents -> orchestrator`

Current: `JiraClient -> JiraTicketAgent -> JSON project snapshot`.

Planned agents: Task Assignment, Risk Analysis, Project Assistant, and an Orchestrator that coordinates them.

## First-time setup

1. Install Node.js 20.6 or later.
2. Copy `.env.example` to `.env`.
3. In Atlassian Account settings, create an API token. Put your Atlassian email and token in `.env`; keep `JIRA_PROJECT_KEY=SCRUM`.
4. Run `npm test` to verify the local agent logic.
5. Run `npm start` to fetch and print your Jira project snapshot.

Do not commit `.env` or share its tokens.

## Jira test/demo workflow

You only need one or two sample Jira issues in `SCRUM`. The Ticket Agent reads them; it does not need assignments or a manually maintained backlog. A later step can add controlled ticket creation/updates once the read flow is verified.

## Future platform credentials

GitHub will use a fine-grained personal access token scoped to `Team8mvsl/SprintMind`. Webex will use a bearer access token and, when needed, a room ID. Those values are already reserved in `.env.example` but are not used by this first Jira read-only version.
