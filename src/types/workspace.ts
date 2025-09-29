export interface Workspace {
  _id?: string;
  name: string;
  description?: string;
  ownerId?: string;
  color?: string;
  members?: WorkspaceMember[];
  settings?: WorkspaceSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkspaceMember {
  uid: string;
  role?: "admin" | "manager" | "member" | "viewer";
}

export interface WorkspaceSettings {
  allowInvites?: boolean;
  isPublic?: boolean;
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
  dueDate?: Date;
  estimate?: number;
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
  avatarUrl: string;
}

