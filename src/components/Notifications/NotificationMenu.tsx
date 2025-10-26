import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import NotificationItem from "./NotificationsItem";
import type { NotificationInter } from "../../types/notification";
import { getColorForIndex } from "../../utils/helperFuns";
import { NavLink } from "react-router-dom";

interface NotificationProps {
  id?: string;
  notificationList: NotificationInter[] | null;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  notificationList,
  anchorRef,
  visible,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 5,
    left: 0,
  });

  useEffect(() => {
    if (anchorRef.current && visible) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
  }, [anchorRef, visible]);

  if (!visible || !anchorRef.current) return null;

  let content: React.ReactNode;

  if (notificationList === null || notificationList?.length === 0) {
    content = (
      <div className="flex flex-col justify-center min-h-50 text-sm text-center text-black dark:text-white">
        <p>You don't have any notifications</p>
      </div>
    );
  }

  const notMarkAsReadNotifications =
    notificationList?.filter((note) => !note.read) || [];

  if (
    notificationList &&
    notificationList?.length > 0 &&
    notMarkAsReadNotifications?.length === 0
  ) {
    content = (
      <div className="flex flex-col justify-between min-h-50 text-sm text-center text-black dark:text-white">
        <p className="mt-18">You don't have any new notifications</p>
        <div className="border-t mt-4 pt-3 text-right">
          <NavLink
            to="/notifications"
            className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline text-sm transition"
          >
            View all
          </NavLink>
        </div>
      </div>
    );
  }

  if (
    notificationList &&
    notificationList?.length > 0 &&
    notMarkAsReadNotifications?.length > 0
  ) {
    content = (
      <>
        <ul className="flex flex-col gap-3 px-1.5 max-h-50 overflow-auto custom-scrollbar">
          {notificationList.map((item, index) => {
            const colorClass = getColorForIndex(index);
            if (item.read) {
              return null;
            }
            return (
              <NotificationItem
                key={index}
                data={item}
                colorClass={colorClass}
              />
            );
          })}
        </ul>
        <div className="border-t mt-4 pt-3 text-right">
          <NavLink
            to="/notifications"
            className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline text-sm transition"
          >
            View all
          </NavLink>
        </div>
      </>
    );
  }

  return createPortal(
    <menu
      id={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-0 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md shadow-2xl rounded-xl border-t-4 border-indigo-500 p-5 w-[180px] min-w-[180px] md:min-w-[190px] lg:min-w-[210px] lg:-translate-x-3 xl:min-w-[245px] xl:-translate-x-8  z-50 text-black dark:text-white transition duration-300"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {content}
    </menu>,
    document.getElementById("notification-root")!
  );
};

export default Notification;
