import React from "react";
import NotificationsItem from "./NotificationsItem";
import type { NotificationInter } from "../../types/notification";
import { getColorForIndex } from "../Utils/helperFuns";
import { Button } from "../ui/Button";
import { useDispatch } from "react-redux";
import { appActions } from "../../store/appSlice";
import { Trash } from "lucide-react";

interface NotificationsListProps {
  data: NotificationInter[] | null;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ data }) => {
  const dispatch = useDispatch();
  const notMarkAsReadNotifications = data?.filter((note) => !note.read) || [];

  return (
    <div className="glassmorphic rounded-2xl p-8">
      <div className="flex justify-between">
        <h3 className="relative text-xl font-semibold dark:text-white text-black mb-6">
          All Notifications
          <div className="absolute -top-1 left-40 w-5 h-5 bg-gradient-to-r from-[#d64f4f] to-[#b74fd6] rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {data?.length || 0}
            </span>
          </div>
        </h3>
        <div className="flex justify-center gap-2">
          {data && notMarkAsReadNotifications?.length > 0 && (
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
          {data && data.length > 0 && (
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
        {data &&
          data.map((item, index) => {
            const colorClass = getColorForIndex(index);
            return (
              <NotificationsItem
                key={item._id}
                data={item}
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
