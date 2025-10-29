import React, { useEffect, useState } from "react";
import NotificationsList from "../components/Notifications/NotificationsList";
import { useAuthContext } from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import toast from "react-hot-toast";
import { appActions } from "../store/appSlice";
import type {
  InvitationStatus,
  NotificationInter,
} from "../types/notification";
import Loading from "../components/UI/Loading";
import { ConfirmationModal } from "../components/UI/ConfirmationModal";
const NotificationPage: React.FC = () => {
  const { user } = useAuthContext();
  const dispatch = useDispatch<AppDispatch>();

  const [notifications, setNotifications] = useState<NotificationInter[]>();
  const [declineInvite, setDeclineInvite] = useState(false);
  const [deleteNotificationAction, setDeleteNotificationAction] =
    useState(false);
  const [deleteAllNotificationsAction, setDeleteAllNotificationsAction] =
    useState(false);

  const invitationStatus = useSelector(
    (state: RootState) => state.app.invitationStatus
  );
  const markAsRead = useSelector((state: RootState) => state.app.markAsRead);
  const isMarkAllAsRead = useSelector(
    (state: RootState) => state.app.isMarkAllAsRead
  );
  const deletedNoteId = useSelector(
    (state: RootState) => state.app.deletedNoteId
  );
  const isAllNotesDeleted = useSelector(
    (state: RootState) => state.app.isAllNotesDeleted
  );
  const isConfirmationModal = useSelector(
    (state: RootState) => state.app.isConfirmationModal
  );

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/notifications`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setNotifications(data?.data?.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    const handleInvite = async (invite: InvitationStatus) => {
      try {
        let inviteURL = `${import.meta.env.VITE_API_URL}/workspaces/${
          invite.workspaceId
        }/members/`;

        if (invite.status === "accepted") {
          inviteURL = inviteURL + `accept-invite/${invite.inviteId}`;
        }
        if (declineInvite && invite.status === "declined") {
          inviteURL = inviteURL + `decline-invite/${invite.inviteId}`;
        }

        const res = await fetch(inviteURL, {
          method: "POST",
          credentials: "include",
        });
        if (res.status === 200 && invite.status === "accepted") {
          toast.success("Invite accepted successfully!");
        } else if (res.status === 200 && invite.status === "declined") {
          toast.success("Invite declined successfully!");
        } else {
          toast.error("Failed to accept invite. Please try again.");
        }

        dispatch(appActions.setInvitationStatus(null));
      } catch (_) {
        if (invite.status === "accepted") {
          toast.error("Failed to accept invite. Please try again.");
        }
        if (invite.status === "declined") {
          toast.error("Failed to decline invite. Please try again.");
        }
      }
    };
    const markNotificationAsRead = async (noteId: string) => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/notifications/${noteId}/read`,
          {
            method: "PATCH",
            credentials: "include",
          }
        );
        dispatch(appActions.setMarkAsRead(null));
        toast.success("Notification has been marked as read!");
      } catch (_) {
        toast.error("Failed to mark notification as read. Please try again.");
      }
    };
    const markAllNotificationsAsRead = async () => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/notifications/mark-all-read`,
          {
            method: "PATCH",
            credentials: "include",
          }
        );
        dispatch(appActions.setIsMarkAllAsRead(null));
        toast.success("All Notifications has been marked as read!");
      } catch (_) {
        toast.error(
          "Failed to mark all notifications as read. Please try again."
        );
      }
    };
    const deleteNotification = async (noteId: string) => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/notifications/${noteId}`, {
          method: "DELETE",
          credentials: "include",
        });
        dispatch(appActions.setDeletedNoteId(null));
        toast.success("Notification has been deleted successfully!");
      } catch (_) {
        toast.error("Failed to delete notification. Please try again.");
      }
    };
    const deleteAllNotifications = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
          method: "DELETE",
          credentials: "include",
        });
        dispatch(appActions.setIsAllNotesDeleted(null));
        toast.success("All Notifications has been deleted successfully!");
      } catch (_) {
        toast.error("Failed to delete all notifications. Please try again.");
      }
    };

    if (invitationStatus !== null) {
      handleInvite(invitationStatus);
    }

    if (markAsRead !== null) {
      markNotificationAsRead(markAsRead);
    }

    if (isMarkAllAsRead !== null) {
      markAllNotificationsAsRead();
    }

    if (deleteNotificationAction && deletedNoteId !== null) {
      deleteNotification(deletedNoteId);
      setDeleteNotificationAction(false);
    }
    if (deleteAllNotificationsAction && isAllNotesDeleted !== null) {
      deleteAllNotifications();
      setDeleteAllNotificationsAction(false);
    }

    if (user) {
      getNotifications();
    }
  }, [
    declineInvite,
    deleteAllNotificationsAction,
    deleteNotificationAction,
    deletedNoteId,
    dispatch,
    invitationStatus,
    isAllNotesDeleted,
    isMarkAllAsRead,
    markAsRead,
    user,
  ]);

  let content: React.ReactNode;

  if (notifications === undefined) {
    content = (
      <div className="glassmorphic rounded-2xl p-8 min-h-150 flex flex-col items-center justify-center">
        <Loading />
      </div>
    );
  } else {
    if (notifications.length === 0) {
      content = (
        <div className="glassmorphic rounded-2xl p-8 min-h-150 flex flex-col items-center justify-center text-md font-semibold !text-gray-700">
          <p>No updates right now. Stay tuned!</p>
        </div>
      );
    }

    if (notifications.length > 0) {
      content = <NotificationsList notes={notifications || null} />;
    }
  }

  return (
    <>
      <div className="px-6 pb-6">{content}</div>
      {isConfirmationModal && invitationStatus && (
        <ConfirmationModal
          isOpen={isConfirmationModal}
          action={() => setDeclineInvite(true)}
          title={"Confirmation"}
          message={"Are you sure you want to decline this invite?"}
          type="invite"
        />
      )}
      {isConfirmationModal && deletedNoteId && (
        <ConfirmationModal
          isOpen={isConfirmationModal}
          action={() => setDeleteNotificationAction(true)}
          title={"Confirmation"}
          message={"Are you sure you want to delete this notification?"}
          type="notification"
        />
      )}
      {isConfirmationModal && isAllNotesDeleted && (
        <ConfirmationModal
          isOpen={isConfirmationModal}
          action={() => setDeleteAllNotificationsAction(true)}
          title={"Confirmation"}
          message={"Are you sure you want to delete all these notifications?"}
          type="notifications"
        />
      )}
    </>
  );
};

export default NotificationPage;
