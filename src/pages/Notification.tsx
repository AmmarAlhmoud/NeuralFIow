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
import Loading from "../components/ui/Loading";
const NotificationPage: React.FC = () => {
  const { user } = useAuthContext();
  const dispatch = useDispatch<AppDispatch>();

  const [notifications, setNotifications] = useState<NotificationInter[]>();
  const [notificationsLength, setNotificationsLength] = useState(0);

  const invitationStatus = useSelector(
    (state: RootState) => state.app.invitationStatus
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
        setNotificationsLength(data?.data?.length);
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
        if (invite.status === "declined") {
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

        dispatch(appActions.setIsInvitationStatus(null));
      } catch (_) {
        if (invite.status === "accepted") {
          toast.error("Failed to accept invite. Please try again.");
        }
        if (invite.status === "declined") {
          toast.error("Failed to decline invite. Please try again.");
        }
      }
    };

    if (invitationStatus !== null) {
      handleInvite(invitationStatus);
    }

    if (user) {
      getNotifications();
    }
  }, [dispatch, invitationStatus, user]);

  let content: React.ReactNode;

  if (notifications === undefined) {
    content = (
      <div className="glassmorphic rounded-2xl p-8 min-h-150 flex flex-col items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (notifications?.length === 0) {
    content = (
      <div className="glassmorphic rounded-2xl p-8 min-h-150 flex flex-col items-center justify-center text-xl font-semibold">
        <p>No updates right now. Stay tuned!</p>
      </div>
    );
  }

  if (notifications?.length !== 0) {
    content = (
      <NotificationsList
        data={notifications || null}
        noteNum={notificationsLength}
      />
    );
  }

  return <div className="px-6 pb-6">{content}</div>;
};

export default NotificationPage;
