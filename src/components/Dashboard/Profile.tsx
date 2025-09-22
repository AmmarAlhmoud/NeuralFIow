import React from "react";
import { Moon, Sun, Bell, LogOut } from "lucide-react";
import { type ProfileProps } from "../../types/dashboard";

const Profile: React.FC<ProfileProps> = ({
  onThemeToggle,
  isDarkMode,
  className,
  userData,
  handleLogout,
}) => {
  const avatarURL = userData?.avatarURL
    ? userData.avatarURL.replace(/=s0$/, "=s200")
    : "https://www.gravatar.com/avatar/?d=mp";

  return (
    <section className={`overflow-hidden ${className}`}>
      <div className="flex flex-col justify-between px-4 sm:mt-4 xl:mt-0 sm:flex-row sm:items-center sm:space-x-3">
        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="p-3 rounded-xl dark:hover:bg-white/10 hover:bg-black/10 group transition-all"
        >
          {isDarkMode ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#b74fd6] transition-colors" />
          ) : (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#b74fd6] transition-colors" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-3 rounded-xl dark:hover:bg-white/10 hover:bg-black/10 group transition-all">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#d64f4f] transition-colors" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#d64f4f] to-[#b74fd6] rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">3</span>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="relative p-3 rounded-xl dark:hover:bg-white/10 hover:bg-black/10 group transition-all"
        >
          <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#d64f4f] transition-colors" />
        </button>
      </div>

      {/* Profile */}
      <div
        className="w-50 max-w-full flex items-center xl:flex-row space-x-3 p-2 rounded-xl  
                            hover:bg-gray-200/10 dark:hover:bg-white/10 cursor-pointer group transition-all overflow-hidden"
      >
        <div className="relative w-10 h-10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(183,79,214,0.4)]">
          <img
            src={avatarURL}
            alt="User Avatar"
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#b74fd6]">
            {userData?.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Product Lead
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
