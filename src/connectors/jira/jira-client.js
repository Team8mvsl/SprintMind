import { requestJson } from "../../core/http-client.js";

export class JiraClient {
  constructor({ baseUrl, email, apiToken }, fetchImpl = fetch) {
    this.baseUrl = baseUrl;
    this.fetch = fetchImpl;
    this.authorization = "Basic " + Buffer.from(email + ":" + apiToken).toString("base64");
  }

  async searchIssues(jql, maxResults = 50) {
    return requestJson(
      this.baseUrl + "/rest/api/3/search/jql",
      {
        method: "POST",
        headers: { Authorization: this.authorization, "Content-Type": "application/json" },
        body: JSON.stringify({
          jql, maxResults,
          fields: ["summary", "status", "assignee", "priority", "issuetype", "project", "updated", "created", "description", "parent", "labels"]
        })
      }, this.fetch
    );
  }
}
