export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done";
  priority: "high" | "medium" | "low";
  tags: string[];
  assignees: string[];
  dueDate: string;
  progress?: number;
  isAiOptimized?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isOnline: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  memberCount: number;
  color: string;
}

export type PageType = "dashboard" | "analytics" | "settings";

export interface DashboardProps {
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

export interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
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
  isDarkMode: boolean;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onToggle: () => void;
  onThemeToggle: () => void;
  workspaces: Workspace[];
}

export interface HeaderProps {
  currentPage: PageType;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ProfileProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  className?: string;
}
