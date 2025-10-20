export interface NotificationPayload {
  taskId?: string;
  workspaceId: string;
  projectId?: string;
  actorId?: string;
  inviteId?: string;
}

export type NotificationType =
  | "membership_invite"
  | "membership_removed"
  | "role_updated"
  | "task_assigned"
  | "task_updated"
  | "task_deleted"
  | "comment_added"
  | "status_changed"
  | "mention";

export interface NotificationInter {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  payload: NotificationPayload;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
}

export type InvitationStatus = {
  inviteId: string;
  workspaceId: string;
  status: "accepted" | "declined";
};

