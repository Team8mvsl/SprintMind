import { Connector } from "../connector.js";

// Intentionally small until the Project Assistant needs conversation context.
export class WebexConnector extends Connector {
  constructor(config) { super("webex"); this.config = config; }
}
