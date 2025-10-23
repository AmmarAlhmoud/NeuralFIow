import React, { useEffect, useRef } from "react";
import NotificationsItem from "./NotificationsItem";
import type { NotificationInter } from "../../types/notification";
import { getColorForIndex } from "../../utils/helperFuns";
import { Button } from "../ui/Button";
import { useDispatch } from "react-redux";
import { appActions } from "../../store/appSlice";
import { Trash } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface NotificationsListProps {
  notes: NotificationInter[] | null;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ notes }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { noteId } = useParams<{ noteId?: string }>();
  const notMarkAsReadNotifications = notes?.filter((note) => !note.read) || [];

  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  // reset removed keys when notes change
  useEffect(() => {
    if (!notes) return;
    const keys = new Set(notes.map((n) => n._id));
    Object.keys(itemRefs.current).forEach((k) => {
      if (!keys.has(k)) delete itemRefs.current[k];
    });
  }, [notes]);

  useEffect(() => {
    if (!noteId) return;
    // The requestAnimationFrame fun delays execution until the browser is about to paint, guaranteeing the element is in its final position before scrolling
    requestAnimationFrame(() => {
      itemRefs.current[noteId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      itemRefs.current[noteId]?.animate(
        [
          {
            backgroundColor: "transparent",
            boxShadow: "0 0 0 rgba(99, 102, 241, 0)",
          },
          {
            backgroundColor: "rgba(99, 102, 241, 0.15)",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
            offset: 0.5,
          },
        ],
        {
          duration: 1800,
          easing: "ease-in-out",
        }
      );
    });

    setTimeout(() => {
      navigate("/notifications", { replace: true });
    }, 300);
  }, [navigate, noteId, notes]);

  return (
    <div className="glassmorphic rounded-2xl p-8">
      <div className="flex justify-between">
        <h3 className="relative text-xl font-semibold dark:text-white text-black mb-6">
          All Notifications
          <div className="absolute -top-1 left-40 w-5 h-5 bg-gradient-to-r from-[#d64f4f] to-[#b74fd6] rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {notes?.length || 0}
            </span>
          </div>
        </h3>
        <div className="flex justify-center gap-2">
          {notes && notMarkAsReadNotifications?.length > 0 && (
            <div>
              <Button
                title="Mark All as Read"
                variant="noBg"
                size="xs"
                onClick={(_) => {
                  dispatch(appActions.setIsMarkAllAsRead(true));
                }}
              >
                Mark All as Read
              </Button>
            </div>
          )}
          {notes && notes.length > 0 && (
            <div>
              <Button
                title="Delete All Notifications"
                variant="noBg"
                size="xs"
                className="flex justify-center items-center gap-0.5 !text-red-500"
                onClick={(_) => {
                  dispatch(appActions.setIsAllNotesDeleted(true));
                  dispatch(appActions.setIsConfirmationModal(true));
                }}
              >
                <Trash className="h-4 w-4 text-red-500 group-hover:cursor-pointer group-hover:animate-bounce duration-200" />
                Delete All
              </Button>
            </div>
          )}
        </div>
      </div>
      <ul className="flex flex-col gap-2 min-h-120 max-h-120 overflow-auto custom-scrollbar">
        {notes &&
          notes.map((note, index) => {
            const colorClass = getColorForIndex(index);
            return (
              <NotificationsItem
                key={note._id}
                ref={(el) => {
                  itemRefs.current[note._id] = el;
                }}
                data={note}
                colorClass={colorClass}
                type="page"
              />
            );
          })}
      </ul>
    </div>
  );
};

export default NotificationsList;
