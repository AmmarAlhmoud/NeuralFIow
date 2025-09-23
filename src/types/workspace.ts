export interface Workspace {
  _id?: string;
  name: string;
  description?: string;
  ownerId: string;
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
