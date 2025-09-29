import type { AuthUser } from "./auth";
import type { Workspace } from "./workspace";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isOnline: boolean;
}

export type PageType =
  | "home"
  | "dashboard"
  | "analytics"
  | "settings"
  | "project";

export interface DashboardProps {
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

export interface StatsCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: string;
  changeText: string;
  isPositive: boolean;
  bgColor: string;
}

export interface SidebarProps {
  isCollapsed: boolean;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onToggle: () => void;
  workspaces: Workspace[];
  setWorkspacesModal: (status: boolean) => void;
}

export interface HeaderProps {
  currentPage: PageType;
}

export interface ProfileProps {
  userData: AuthUser | null;
  className?: string;
  handleLogout: () => Promise<void>;
}
