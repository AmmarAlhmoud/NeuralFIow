import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  ChevronLeft,
  Plus,
  Home,
  UserRoundCog,
  Bell,
} from "lucide-react";
import type { SidebarProps, PageType } from "../../types/dashboard";
import Profile from "./Profile";
import { useAuthContext } from "../../hooks/useAuth";
import { Button } from "../UI/Button";
import WorkspaceItem from "./WorkspaceItem";
import Loading from "../UI/Loading";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  currentPage,
  onPageChange,
  onToggle,
  workspaces,
  setWorkspacesModal,
}) => {
  const { user, logout } = useAuthContext();
  const currentUserRole = useSelector(
    (state: RootState) => state.app.currentUserRole
  );

  const navigationItemsNoWorkspace = [
    {
      id: "home",
      icon: Home,
      label: "Home",
    },
    {
      id: "profile",
      icon: UserRoundCog,
      label: "Profile",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
    },
  ];

  let navigationItemsWithWorkspace = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },

    { id: "settings", icon: Settings, label: "Settings" },
  ];

  if (currentUserRole === "admin" || currentUserRole === "manager") {
    navigationItemsWithWorkspace = [
      ...navigationItemsWithWorkspace,
      { id: "analytics", icon: BarChart3, label: "Analytics" },
    ];
  }

  let navigationItems = [];

  if (
    currentPage === "home" ||
    currentPage === "profile" ||
    currentPage === "notifications"
  ) {
    navigationItems = navigationItemsNoWorkspace;
  } else {
    navigationItems = navigationItemsWithWorkspace;
  }

  let workspacesList: React.ReactNode;

  if (workspaces === undefined) {
    workspacesList = (
      <div className="my-10">
        <Loading />
      </div>
    );
  }

  if (workspaces?.length === 0) {
    workspacesList = (
      <div className="text-sm text-gray-500">No workspaces available</div>
    );
  }

  if (workspaces !== undefined) {
    if (workspaces!.length > 0) {
      workspacesList = workspaces.map((workspace) => (
        <WorkspaceItem
          key={workspace._id}
          workspace={workspace}
          currentPage={currentPage}
        />
      ));
    }
  }

  return (
    <div
      className={`fixed left-0 top-0 h-full glassmorphic z-30 transition-all duration-500 ${
        isCollapsed ? "w-8 md:w-26" : "w-72"
      }`}
    >
      <div className={`p-6 ${isCollapsed ? "hidden md:block" : ""}`}>
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

        <Profile
          userData={user}
          handleLogout={logout}
          className="flex flex-row-reverse mb-8 pb-8 border-b dark:border-white/10 border-black/10 sm:hidden"
        />

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

        {currentPage !== "home" &&
          currentPage !== "profile" &&
          currentPage !== "notifications" &&
          !isCollapsed && (
            <div className="mt-8 pt-8 border-t dark:border-white/10 border-black/10">
              <div className="text-xs font-semibold dark:text-gray-400 text-gray-800 mb-4 tracking-wider uppercase">
                Workspaces
              </div>
              <div className="space-y-4">
                <div className="flex flex-col min-h-60 max-h-60 overflow-y-auto space-y-1.5 custom-scrollbar px-2">
                  {workspacesList}
                </div>
                <div className="flex flex-col mt-3">
                  <Button
                    type="button"
                    variant="gradient"
                    className="flex space-x-2"
                    onClick={() => setWorkspacesModal(true)}
                  >
                    <Plus />
                    <span>Create Workspace</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
      </div>

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
