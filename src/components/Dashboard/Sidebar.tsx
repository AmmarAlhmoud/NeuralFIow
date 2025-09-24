import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  ChevronLeft,
  Plus,
} from "lucide-react";
import type { SidebarProps, PageType } from "../../types/dashboard";
import Profile from "./Profile";
import { useAuthContext } from "../../hooks/useAuth";

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  currentPage,
  onPageChange,
  onToggle,
  workspaces,
  onThemeToggle,
  isDarkMode,
  setWorkspacesModal,
}) => {
  const { user, logout } = useAuthContext();

  const shadeColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const getGradientFromColor = (hex: string) => {
    const lighter = shadeColor(hex, 40); // +40 to lighten
    const darker = shadeColor(hex, -40); // -40 to darken
    return `linear-gradient(135deg, ${lighter}, ${darker})`;
  };

  const navigationItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  let workspacesList: React.ReactNode;

  if (workspaces?.length === 0) {
    workspacesList = (
      <div className="text-sm text-gray-500">No workspaces available</div>
    );
  }

  if (workspaces?.length > 0) {
    workspacesList = workspaces.map((workspace) => (
      <div
        key={workspace._id}
        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer group transition-all"
      >
        <div
          className={`w-8 h-8 bg-gradient-to-r rounded-lg flex items-center justify-center`}
          style={{
            background: getGradientFromColor(workspace.color!),
          }}
        >
          <span className="dark:text-white text-black font-bold text-sm">
            {workspace.name[0]}
          </span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium dark:text-gray-300  text-gray-700 dark:group-hover:text-white group-hover:text-black">
            {workspace.name}
          </div>
          <div className="text-xs text-gray-500">
            {workspace.members?.length} members
          </div>
        </div>
      </div>
    ));
  }

  return (
    <div
      className={`fixed left-0 top-0 h-full glassmorphic z-30 transition-all duration-500 ${
        isCollapsed ? "w-8 md:w-26" : "w-72"
      }`}
    >
      <div className={`p-6 ${isCollapsed ? "hidden md:block" : ""}`}>
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div
            className={`w-10 h-10 ${
              isCollapsed ? "ml-2" : ""
            } bg-gradient-to-r from-neon-scarlet to-neon-fuchsia rounded-xl flex items-center justify-center neon-glow`}
          >
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="transition-all duration-300">
              <span className="text-xl font-bold bg-gradient-to-r from-neon-scarlet to-neon-fuchsia bg-clip-text text-transparent">
                NeuralFlow
              </span>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">
                  AI Active
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}

        <Profile
          onThemeToggle={onThemeToggle}
          isDarkMode={isDarkMode}
          userData={user}
          handleLogout={logout}
          className="flex flex-row-reverse mb-8 pb-8 border-b dark:border-white/10 border-black/10 sm:hidden"
        />

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onPageChange(id as PageType)}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                currentPage === id
                  ? "bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 neon-glow"
                  : "dark:hover:bg-white/5 dark:hover:border-white/10 hover:bg-black/5 hover:border-black/10 border border-transparent"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  currentPage === id
                    ? "dark:text-violet-400 text-violet-800"
                    : "dark:text-gray-400 text-gray-800 dark:group-hover:text-cyan-400 group-hover:text-cyan-800"
                }`}
              />
              {!isCollapsed && (
                <span
                  className={`font-medium transition-all duration-300 ${
                    currentPage === id
                      ? "dark:text-violet-300 text-violet-700"
                      : "dark:text-gray-300 text-gray-700 dark:group-hover:text-white group-hover:text-black"
                  }`}
                >
                  {label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Workspaces */}
        {!isCollapsed && (
          <div className="mt-8 pt-8 border-t dark:border-white/10 border-black/10">
            <div className="text-xs font-semibold dark:text-gray-400 text-gray-800 mb-4 tracking-wider uppercase">
              Workspaces
            </div>
            <div className="space-y-3">
              <div className="h-60 overflow-y-scroll custom-scrollbar">{workspacesList}</div>
              <div className="flex flex-col mt-3">
                <button
                  onClick={() => setWorkspacesModal(true)}
                  className="relative overflow-hidden bg-gradient-to-r from-neon-scarlet to-neon-fuchsia hover:from-neon-fuchsia hover:to-neon-scarlet text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <span className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Create Workspace</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={onToggle}
        className="absolute -right-4 top-8 w-8 h-8 glassmorphic rounded-full flex items-center justify-center hover:neon-glow group transition-all"
      >
        <ChevronLeft
          className={`w-4 h-4 dark:text-gray-400 text-gray-800 dark:group-hover:text-violet-400 group-hover:text-violet-800 transition-all duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default Sidebar;
