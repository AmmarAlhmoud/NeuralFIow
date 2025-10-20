import React from "react";
import { useDispatch } from "react-redux";
import useTimezone from "../../hooks/useTimezone";
import type { NotificationInter } from "../../types/notification";
import { Button } from "../ui/Button";
import type { AppDispatch } from "../../store/store";
import { appActions } from "../../store/appSlice";
import { Trash } from "lucide-react";

interface NotificationsItemProps {
  data: NotificationInter;
  colorClass: string;
  type?: string;
}

const NotificationsItem: React.FC<NotificationsItemProps> = ({
  data,
  colorClass,
  type,
}) => {
  const { formatDate } = useTimezone();
  const dispatch = useDispatch<AppDispatch>();

  if (type === "page") {
    return (
      <li className="flex items-start gap-4 px-7 py-5 rounded-lg shadow-md shadow-black/10 bg-slate-100 dark:bg-gray-800 duration-300 ease-in-out select-none">
        <span className="mt-1">
          <svg
            className={`h-6 w-6 ${colorClass}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={50}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M13 16h-1v-4h-1m0-4h.01"></path>
          </svg>
        </span>
        <div className="flex flex-col flex-grow">
          <div className="text-md font-medium text-gray-900 dark:text-gray-100">
            {data.title}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {data.message}
          </div>
          <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            <time dateTime={formatDate(data.createdAt)}>
              {formatDate(data.createdAt)}
            </time>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {data.type === "membership_invite" && !data.read && (
            <div className="flex gap-4 mt-4">
              <Button
                title="Accept Invitation"
                variant="social"
                size="xs"
                onClick={(_) => {
                  dispatch(
                    appActions.setInvitationStatus({
                      inviteId: data.payload.inviteId!,
                      workspaceId: data.payload.workspaceId,
                      status: "accepted",
                    })
                  );
                }}
              >
                Accept
              </Button>
              <Button
                title="Decline Invitation"
                variant="warning"
                size="xs"
                onClick={(_) => {
                  dispatch(
                    appActions.setInvitationStatus({
                      inviteId: data.payload.inviteId!,
                      workspaceId: data.payload.workspaceId,
                      status: "declined",
                    })
                  );
                  dispatch(appActions.setIsConfirmationModal(true));
                }}
              >
                Decline
              </Button>
            </div>
          )}
          {data.type !== "membership_invite" && !data.read && (
            <div className="mt-4" title="Mark as Read">
              <Button
                variant="noBg"
                size="xs"
                onClick={(_) => {
                  dispatch(appActions.setMarkAsRead(data._id));
                }}
              >
                Mark as Read
              </Button>
            </div>
          )}
          {data.read && (
            <div className="mt-6" title="Delete Notification">
              <Trash
                className="h-5 w-5 text-red-500 hover:cursor-pointer hover:animate-bounce duration-200"
                onClick={(_) => {
                  dispatch(appActions.setDeletedNoteId(data._id));
                  dispatch(appActions.setIsConfirmationModal(true));
                }}
              >
                Delete
              </Trash>
            </div>
          )}
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-2 rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-700/30 cursor-pointer transition">
      <span className="mt-1">
        <svg
          className={`h-4 w-4 ${colorClass}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={50}
          viewBox="0 0 24 24"
        >
          <path d="M13 16h-1v-4h-1m0-4h.01"></path>
        </svg>
      </span>
      <div>
        <div className="text-sm font-medium">{data.title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <time dateTime={formatDate(data.createdAt)}>
            {formatDate(data.createdAt)}
          </time>
        </div>
      </div>
    </li>
  );
};

export default NotificationsItem;
