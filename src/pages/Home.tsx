import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import TaskDrawer from "../components/Dashboard/TaskDrawer";
import DashboardPage from "../pages/Dashboard";
import AnalyticsPage from "../pages/Analytics";
import SettingsPage from "../pages/Settings";
import type { Task, TeamMember, PageType } from "../types/dashboard";
import type { Workspace } from "../types/workspace";
import { useAuthContext } from "../hooks/useAuth";
import { WorkspaceModal } from "../components/ui/WorkspaceModal";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [workspacesModal, setWorkspacesModal] = useState(false);
  const [workspacesData, setWorkspacesData] = useState<Workspace | null>();

  const getCurrentPage = (): PageType => {
    if (location.pathname.includes("analytics")) return "analytics";
    if (location.pathname.includes("settings")) return "settings";
    return "dashboard";
  };
  const currentPage: PageType = getCurrentPage();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

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

  const handleModalStatus = (status: boolean) => {
    setWorkspacesModal(status);
  };

  const createWorkspaceHandler = (formData: Workspace) => {
    if (!user) {
      toast.error("Failed to create workspace try again");
      return;
    }
    const data: Workspace = { ...formData, ownerId: user.uid };
    setWorkspacesData(data);
  };

  useEffect(() => {
    const getWorkspaces = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/workspaces`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Fetched workspaces:", data);
        setWorkspaces(data.data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };
    const createWorkspace = async (workspace: Workspace) => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/workspaces`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workspace),
        });
        setWorkspacesData(null);
        toast.success("Workspace created successfully!");
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    if (workspacesData) {
      createWorkspace(workspacesData);
    }
    if (user && !workspacesData) {
      getWorkspaces();
    }
  }, [user, workspacesData]);

  console.log(workspaces);

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
        setWorkspacesModal={handleModalStatus}
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

      {/* Modal Root */}
      {workspacesModal && (
        <WorkspaceModal
          isOpen={workspacesModal}
          onClose={() => setWorkspacesModal(false)}
          onSubmit={createWorkspaceHandler}
        />
      )}
    </div>
  );
};

export default Home;
