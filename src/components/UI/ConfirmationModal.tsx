import React from "react";
import { CircleQuestionMark } from "lucide-react";
import { Button } from "./Button";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { appActions } from "../../store/appSlice";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  action: () => void;
  type: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  action,
  type,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glassmorphic-white rounded-2xl p-6 max-w-sm w-full text-center neon-glow animate-fade-in">
        <div className="rounded-full flex items-center justify-center mx-auto mb-4">
          {title === "Confirmation" && (
            <CircleQuestionMark className="w-16 h-16" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-800 dark:text-gray-400 mb-4">{message}</p>
        <div className="flex space-x-3 justify-center">
          <Button
            onClick={() => {
              if (type === "task") {
                dispatch(appActions.setClickTask(null));
              }
              if (type === "team") {
                dispatch(appActions.setClickTeamMember(null));
              }
              if (type === "workspace") {
                dispatch(appActions.setDeletedWorkspaceId(null));
              }
              if (type === "notification") {
                dispatch(appActions.setDeletedNoteId(null));
              }
              if (type === "notifications") {
                dispatch(appActions.setIsAllNotesDeleted(null));
              }
              if (type === "invite") {
                dispatch(appActions.setInvitationStatus(null));
              }
              if (type === "project") {
                dispatch(appActions.setClickProject(null));
              }
              dispatch(appActions.setIsConfirmationModal(false));
            }}
            variant="social"
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              action();
              dispatch(appActions.setIsConfirmationModal(false));
            }}
            className="px-6 py-2"
          >
            {type === "task" ||
            type === "workspace" ||
            type === "notification" ||
            type === "notifications" ||
            type === "project"
              ? "Delete"
              : type === "invite"
              ? "Decline"
              : "Remove"}
          </Button>
        </div>
      </div>
    </div>
  );
};
