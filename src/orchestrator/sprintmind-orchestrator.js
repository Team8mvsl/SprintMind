export class SprintMindOrchestrator {
  constructor({ ticketAgent, taskAssignmentAgent, riskAnalysisAgent, projectAssistantAgent }) {
    this.ticketAgent = ticketAgent;
    this.taskAssignmentAgent = taskAssignmentAgent;
    this.riskAnalysisAgent = riskAnalysisAgent;
    this.projectAssistantAgent = projectAssistantAgent;
  }

  async run(team) {
    const projectSnapshot = await this.ticketAgent.getProjectSnapshot();
    const assignmentPlan = this.taskAssignmentAgent.recommend(projectSnapshot, team);
    const riskReport = this.riskAnalysisAgent.analyze(projectSnapshot, assignmentPlan);
    const assistantBriefing = this.projectAssistantAgent.summarize(projectSnapshot, assignmentPlan, riskReport);
    return { projectSnapshot, assignmentPlan, riskReport, assistantBriefing };
  }
}
