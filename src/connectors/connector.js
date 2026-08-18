export class Connector {
  constructor(name) { this.name = name; }
  async healthCheck() { throw new Error(`${this.name} has not implemented healthCheck()`); }
}
