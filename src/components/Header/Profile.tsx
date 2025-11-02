import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Moon, Sun, Bell, LogOut } from "lucide-react";
import type { AppDispatch, RootState } from "../../store/store";
import { type ProfileProps } from "../../types/dashboard";
import { appActions } from "../../store/appSlice";
import NotificationMenu from "../Notifications/NotificationMenu";
import { useAuthContext } from "../../hooks/useAuth";
import { type NotificationInter } from "../../types/notification";

const Profile: React.FC<ProfileProps> = ({
  className,
  userData,
  handleLogout,
}) => {
  const avatarURL = userData?.avatarURL
    ? userData.avatarURL.replace(/=s0$/, "=s200")
    : "https://www.gravatar.com/avatar/?d=mp";

  const isDarkMode = useSelector((state: RootState) => state.app.isDarkMode);
  const dipsatch = useDispatch<AppDispatch>();
  const { user } = useAuthContext();

  const [notifications, setNotifications] = useState<NotificationInter[]>();
  const [notificationsLength, setNotificationsLength] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const openMenu = () => setMenuOpen(true);

  const closeMenuWithDelay = () => {
    setTimeout(() => {
      const isOverButtonOrMenu =
        headerRef.current?.matches(":hover") ||
        document.getElementById("notification-menu")?.matches(":hover");
      if (!isOverButtonOrMenu) {
        setMenuOpen(false);
      }
    }, 100);
  };

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

    if (
      user ||
      invitationStatus ||
      markAsRead ||
      isMarkAllAsRead ||
      deletedNoteId ||
      isAllNotesDeleted
    ) {
      getNotifications();
    }
  }, [
    deletedNoteId,
    invitationStatus,
    isAllNotesDeleted,
    isMarkAllAsRead,
    markAsRead,
    user,
  ]);

  return (
    <section className={`overflow-hidden ${className}`}>
      <div
        ref={headerRef}
        className="min-w-fit flex flex-col gap-1.5 sm:gap-0 justify-between px-4 sm:mt-4 xl:mt-0 sm:flex-row sm:items-center sm:space-x-3"
      >
        <button
          onClick={() => dipsatch(appActions.toggleTheme())}
          className="p-3 rounded-xl dark:hover:bg-white/10 hover:bg-black/10 group transition-all bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 neon-glow"
        >
          {isDarkMode ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#b74fd6] transition-colors" />
          ) : (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#b74fd6] transition-colors" />
          )}
        </button>

        <div
          className="relative"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenuWithDelay}
        >
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="relative p-3 rounded-xl dark:hover:bg-white/10 hover:bg-black/10 group transition-all bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 neon-glow"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#d64f4f] transition-colors" />
            {notificationsLength !== 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#d64f4f] to-[#b74fd6] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {notificationsLength}
                </span>
              </div>
            )}
          </button>

          <NotificationMenu
            id="notification-menu"
            notificationList={notifications || null}
            anchorRef={headerRef}
            visible={menuOpen}
            onMouseEnter={openMenu}
            onMouseLeave={closeMenuWithDelay}
          />
        </div>

        <button
          onClick={handleLogout}
          className="relative p-3 rounded-xl dark:hover:bg-white/10 hover:bg-black/10 group transition-all bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 neon-glow"
        >
          <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#d64f4f] transition-colors" />
        </button>
      </div>

      <NavLink to="/profile" className="mt-6 sm:mt-0">
        <div className="sm:h-auto max-h-full w-40 sm:w-50 max-w-full flex flex-col items-center sm:flex-row sm:items-center xl:flex-row space-x-3 p-2 rounded-xl hover:bg-gray-500/10 dark:hover:bg-white/10 cursor-pointer group transition-all overflow-hidden">
          <div className="relative w-10 h-10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(183,79,214,0.4)]">
            <img
              src={avatarURL}
              alt="User Avatar"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
          </div>

          <div className="text-center sm:text-right mt-1 sm:mt-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#b74fd6]">
              {userData?.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {userData?.position}
            </div>
          </div>
        </div>
      </NavLink>
    </section>
  );
};

export default Profile;
