import { Connector } from "../connector.js";
import { requestJson } from "../../core/http-client.js";

// Kept isolated until a Microsoft Teams webhook is configured.
export class TeamsConnector extends Connector {
  constructor({ webhookUrl }, fetchImpl = fetch) {
    super("teams");
    this.webhookUrl = webhookUrl;
    this.fetch = fetchImpl;
  }

  async postText(text) {
    if (!this.webhookUrl) throw new Error("Missing TEAMS_WEBHOOK_URL");
    return requestJson(this.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    }, this.fetch);
  }
}
