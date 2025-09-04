import React from "react";
import { Search } from "lucide-react";
import { type HeaderProps } from "../../types/dashboard";
import Profile from "./Profile";

const Header: React.FC<HeaderProps> = ({
  currentPage,
  isDarkMode,
  onThemeToggle,
}) => {
  const getPageTitle = (page: string) => {
    const titles = {
      dashboard: "Dashboard",
      analytics: "Analytics",
      settings: "Settings",
    };
    return titles[page as keyof typeof titles] || "Dashboard";
  };

  return (
    <header className="sticky top-3 mx-6 mb-8 xl:mb-6 z-20">
      <div
        className="glassmorphic rounded-2xl p-4 pb-0 xl:pb-4 h-auto xl:h-full
                      bg-white/30 dark:bg-gray-900/30 border border-white/10 dark:border-gray-700/30"
      >
        <div className="w-full flex flex-row xl:flex-row items-center justify-between px-4 space-y-6 xl:space-y-0">
          {/* Left Section */}
          <section
            className="flex-1 flex flex-col justify-center items-center space-y-4 
                              xl:flex-row xl:items-center xl:space-y-0 xl:space-x-6"
          >
            <div className="flex flex-col space-y-2 xl:flex-row justify-center items-center xl:space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent dark:from-white dark:to-gray-300 mt-2">
                {getPageTitle(currentPage)}
              </h1>

              <div className="w-42 flex justify-center items-center space-x-2 bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-400 tracking-wide">
                  AI NEURAL ACTIVE
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-60 xl:w-80 pl-12 pr-4 py-2.5 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 
                         dark:text-white text-black dark:placeholder-gray-400 placeholder-gray-800 transition-all"
                />
                <Search
                  className="absolute left-4 top-3.5 w-5 h-5 dark:text-gray-400 text-gray-700 
                               group-focus-within:text-violet-400 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Right Section */}
          <Profile
            onThemeToggle={onThemeToggle}
            isDarkMode={isDarkMode}
            className="hidden flex-1 sm:flex sm:flex-col-reverse xl:flex-row items-center xl:justify-end space-y-4 xl:space-y-0 xl:space-x-4"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
