import { Connector } from "../connector.js";

export class TeamsConnector extends Connector {
  constructor({ webhookUrl }, fetchImpl = fetch) {
    super("teams");
    this.webhookUrl = webhookUrl;
    this.fetch = fetchImpl;
  }

  async postText(text) {
    if (!this.webhookUrl) throw new Error("Missing TEAMS_WEBHOOK_URL");
    const response = await this.fetch(this.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error("Teams webhook request failed with status " + response.status);
    return { status: response.status };
  }
}
