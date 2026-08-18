export class AgentRegistry {
  constructor() { this.agents = new Map(); }
  register(name, agent) { this.agents.set(name, agent); return this; }
  get(name) { return this.agents.get(name); }
}
