import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import TaskDrawer from "../components/Dashboard/TaskDrawer";
import DashboardPage from "../pages/Dashboard";
import AnalyticsPage from "../pages/Analytics";
import SettingsPage from "../pages/Settings";
import type { Task, TeamMember, Workspace, PageType } from "../types/dashboard";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getCurrentPage = (): PageType => {
    if (location.pathname.includes("analytics")) return "analytics";
    if (location.pathname.includes("settings")) return "settings";
    return "dashboard";
  };
  const currentPage: PageType = getCurrentPage();

  // Mock Data
  const tasks: Task[] = [
    {
      id: "1",
      title: "AI Content Strategy",
      description:
        "Develop comprehensive AI-driven content strategy for Q1 2025 marketing campaigns",
      status: "todo",
      priority: "high",
      tags: ["Strategy", "AI-Generated"],
      assignees: ["violet", "cyan", "green"],
      dueDate: "Dec 28",
      isAiOptimized: true,
    },
    {
      id: "2",
      title: "User Research Analysis",
      description:
        "Analyze user feedback and behavioral data to identify key improvement areas",
      status: "todo",
      priority: "medium",
      tags: ["Research", "Data Analysis"],
      assignees: ["green", "orange"],
      dueDate: "Jan 5",
    },
    {
      id: "3",
      title: "Neural API Integration",
      description:
        "Integrate advanced AI models for automated task prioritization and workflow optimization",
      status: "inprogress",
      priority: "high",
      tags: ["Development", "AI/ML"],
      assignees: ["cyan", "violet"],
      dueDate: "Dec 30",
      progress: 73,
      isAiOptimized: true,
    },
    {
      id: "4",
      title: "Dashboard UI Redesign",
      description:
        "Complete redesign of the main dashboard with modern glassmorphism UI",
      status: "done",
      priority: "low",
      tags: ["Design", "Completed"],
      assignees: ["violet"],
      dueDate: "Completed Dec 20",
    },
  ];

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Alex Chen",
      email: "alex@neuralflow.ai",
      role: "Product Lead",
      avatar: "violet",
      isOnline: true,
    },
    {
      id: "2",
      name: "Sarah Rodriguez",
      email: "sarah@neuralflow.ai",
      role: "AI Engineer",
      avatar: "cyan",
      isOnline: true,
    },
    {
      id: "3",
      name: "Marcus Kim",
      email: "marcus@neuralflow.ai",
      role: "UX Designer",
      avatar: "green",
      isOnline: false,
    },
  ];

  const workspaces: Workspace[] = [
    { id: "1", name: "Marketing AI", memberCount: 12, color: "violet" },
    { id: "2", name: "Product Dev", memberCount: 8, color: "cyan" },
  ];

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newValue;
    });
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const openTaskDrawer = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };
  const closeTaskDrawer = () => {
    setSelectedTask(null);
    setIsDrawerOpen(false);
  };

  const handlePageChange = (page: PageType) => {
    switch (page) {
      case "dashboard":
        navigate("/");
        break;
      case "analytics":
        navigate("/analytics");
        break;
      case "settings":
        navigate("/settings");
        break;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-all duration-500 text-gray-900 dark:text-gray-100">
      {/* Particle Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-[#b74fd6]/30 rounded-full animate-float dark:bg-violet-500/30"
            style={{
              left: `${(i + 1) * 10}%`,
              animationDelay: `${i * 0.5}s`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#b74fd6]/10 via-transparent to-[#d64f4f]/10 pointer-events-none dark:from-violet-500/10 dark:to-cyan-500/10"></div>

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onToggle={toggleSidebar}
        workspaces={workspaces}
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-500 ${
          isSidebarCollapsed ? "ml-8 md:ml-26" : "hidden md:block md:ml-72"
        }`}
      >
        <Header
          currentPage={currentPage}
          onThemeToggle={toggleTheme}
          isDarkMode={isDarkMode}
        />

        {currentPage === "dashboard" && (
          <DashboardPage tasks={tasks} onTaskClick={openTaskDrawer} />
        )}
        {currentPage === "analytics" && <AnalyticsPage />}
        {currentPage === "settings" && (
          <SettingsPage teamMembers={teamMembers} />
        )}
      </div>

      {/* Task Drawer */}
      <TaskDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={closeTaskDrawer}
      />
    </div>
  );
};

export default Home;
