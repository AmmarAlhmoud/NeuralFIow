import type { AuthUser, Role } from "./auth";

export interface Workspace {
  _id?: string;
  name: string;
  description?: string;
  ownerId?: string;
  color?: string;
  members?: TeamMember[];
  settings?: WorkspaceFormSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TeamMember {
  _id?: string;
  uid?: AuthUser;
  name?: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  joinedAt?: string;
  position?: string;
}

export interface WorkspaceFormSettings {
  name?: string;
  aiModel?: string;
  allowInvites?: boolean;
  timezone?: string;
}

export interface UserProfileSettings {
  name: string;
  email: string;
  position?: string | undefined;
}

export interface Project {
  _id?: string;
  workspaceId: string;
  name: string;
  key: string | null;
  description?: string;
  status: "active" | "archived" | "completed";
  createdBy?: {
    _id?: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Task {
  _id?: string;
  projectId: string;
  title: string;
  description?: string;
  assignees: Assignee[] | string[];
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in_progress" | "done";
  dueDate?: Date | null;
  estimate?: number;
  progress?: number;
  tags: string[];
  attachments?: {
    url?: string;
    type?: string;
    name?: string;
    size?: number;
  }[];
  ai?: {
    summary?: string;
    suggestedSubtasks?: string[];
    suggestedPriority?: "low" | "medium" | "high" | "critical";
    priorityReason?: string;
    generationOrder?: string[];
    lastProcessed?: Date;
  };
  createdBy?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Assignee {
  _id?: string;
  name: string;
  email: string;
  avatarURL: string;
}
export interface AICompletedData {
  type: "summary" | "subtasks" | "priority";
  taskId: string;
  data: {
    summary?: string;
    subtasks?: string[];
    priority?: string;
    reason?: string;
    lastProcessed: Date;
  };
}

export interface Comment {
  _id?: string;
  taskId: string;
  authorId?: AuthUser;
  body: string | null;
  mentions?: string[];
  createdAt?: string | null;
  isEdited?: boolean | null;
  editedAt?: Date | null;
}
