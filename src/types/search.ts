import type { TeamMember } from "./workspace";

export type WorkspaceSearchItem = {
  type: "workspace";
  _id: string;
  name: string;
  members: TeamMember[];
  memberCount: number;
  createdAt: string;
};

export type ProjectSearchItem = {
  type: "project";
  _id: string;
  name: string;
  workspaceId: {
    _id: string;
    name: string;
  };
  workspaceName: string;
  status: "active" | "completed" | "archived";
  taskCount: number;
};

export type TaskSearchItem = {
  type: "task";
  _id: string;
  title: string;
  workspaceId: string;
  projectId: string;
  projectName: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  status: "todo" | "in_progress" | "done";
};

// Union type
export type SearchItemData =
  | WorkspaceSearchItem
  | ProjectSearchItem
  | TaskSearchItem;
