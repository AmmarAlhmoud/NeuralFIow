import React from "react";
import { Search, Moon, Sun, Bell } from "lucide-react";
import { type HeaderProps } from "../../types/dashboard";

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
    <header className="sticky top-3 mx-6 mb-8 lg:mb-6 z-20">
      <div
        className="glassmorphic rounded-2xl p-4 pb-0 lg:pb-4 h-auto lg:h-full
                      bg-white/30 dark:bg-gray-900/30 border border-white/10 dark:border-gray-700/30"
      >
        <div className="w-full flex flex-row lg:flex-row items-center justify-between px-4 space-y-6 lg:space-y-0">
          {/* Left Section */}
          <section
            className="flex-1 flex flex-col justify-center items-center space-y-4 
                              lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6"
          >
            <div className="flex flex-col space-y-2 lg:flex-row justify-center items-center lg:space-x-6">
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
                  className="w-60 lg:w-80 pl-12 pr-4 py-2.5 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl 
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
          <section className="flex-1 flex flex-col-reverse lg:flex-row items-center lg:justify-end space-y-4 lg:space-y-0 lg:space-x-4 overflow-hidden">
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
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
            </div>

            {/* Profile */}
            <div
              className="w-40 max-w-full flex items-center lg:flex-row space-x-3 p-2 rounded-xl 
                            hover:bg-gray-200/10 dark:hover:bg-white/10 cursor-pointer group transition-all overflow-hidden"
            >
              <div className="relative">
                <div
                  className="w-10 h-10 bg-gradient-to-r from-[#d64f4f] to-[#b74fd6] rounded-xl 
                                transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(183,79,214,0.4)]"
                ></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#b74fd6]">
                  Alex Chen
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Product Lead
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </header>
  );
};

export default Header;
