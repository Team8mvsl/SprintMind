import { Connector } from "../connector.js";

// Intentionally small until the GitHub work-item agent is added.
export class GitHubConnector extends Connector {
  constructor(config) { super("github"); this.config = config; }
}
