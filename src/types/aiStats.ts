export interface AIStats {
  activeProjects: ActiveProjectsStats;
  teamMembers: TeamMembersStats;
  subtasksGenerated: SubtasksStats;
  hoursSaved: HoursSavedStats;
  aiAccuracy: AccuracyStats;
  automations: AutomationsStats;
  completionRate: number;
  breakdown: AIBreakdown;
}

export interface ActiveProjectsStats {
  total: number;
  thisWeek: number;
  change: number;
}

export interface TeamMembersStats {
  total: number;
  thisWeek: number;
  change: number;
}

export interface SubtasksStats {
  total: number;
  thisWeek: number;
  change: number;
}

export interface HoursSavedStats {
  total: number;
  thisWeek: number;
  change: number;
}

export interface AccuracyStats {
  rate: number;
  change: number;
}

export interface AutomationsStats {
  total: number;
  efficiencyBoost: number;
}

export interface AIBreakdown {
  summaries: number;
  priorities: number;
  subtasks: number;
}
