import React, { useState, useEffect } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  redirect,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../components/Dashboard/Sidebar";
import ScrollToTop from "../components/ui/ScrollToTop";
import Header from "../components/Dashboard/Header";
import HomePage from "./Home";
import type { PageType } from "../types/dashboard";
import type { Project, Workspace } from "../types/workspace";
import { WorkspaceModal } from "../components/Dashboard/WorkspaceModal";
import { useAuthContext } from "../hooks/useAuth";
import { Outlet } from "react-router-dom";
import { ProjectModal } from "../components/Dashboard/ProjectModal";
import type { RootState } from "../store/store";
import { appActions } from "../store/appSlice";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { workspaceId, projectId } = useParams();
  const { user } = useAuthContext();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [workspacesModal, setWorkspacesModal] = useState(false);
  const [workspacesData, setWorkspacesData] = useState<Workspace | null>();
  const [projectData, setProjectData] = useState<Project | null>();

  // App wide state
  const projectModal = useSelector(
    (state: RootState) => state.app.projectModal
  );

  const getCurrentPage = (): PageType => {
    if (location.pathname.includes("analytics")) return "analytics";
    if (location.pathname.includes("settings")) return "settings";
    if (workspaceId !== undefined && !projectId) {
      return "dashboard";
    }
    if (projectId !== undefined) {
      return "project";
    }
    return "home";
  };

  const currentPage: PageType = getCurrentPage();
  const [workspaces, setWorkspaces] = useState<Workspace[] | undefined>();

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handlePageChange = (page: PageType) => {
    switch (page) {
      case "home":
        navigate("/");
        break;
      case "dashboard":
        navigate(`/workspace/${workspaceId}`);
        break;
      case "analytics":
        navigate(`/workspace/${workspaceId}/analytics`);
        break;
      case "settings":
        navigate(`/workspace/${workspaceId}/settings`);
        break;
    }
  };

  const createWorkspaceHandler = (formData: Workspace) => {
    if (!user) {
      toast.error("Failed to create workspace try again");
      return;
    }
    setWorkspacesData(formData);
  };

  const createProjectHandler = (formData: Project) => {
    if (!user) {
      toast.error("Failed to create project try again");
      return;
    }

    setProjectData(formData);
  };

  useEffect(() => {
    const getWorkspaces = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/workspaces`, {
          credentials: "include",
        });
        const data = await res.json();
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
      } catch (_) {
        toast.error("Failed to create workspace. Please try again.");
      }
    };
    const getProjects = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/projects/by-workspace/${workspaceId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        dispatch(appActions.setProjectsData(data.data));
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    const createProject = async (project: Project) => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(project),
        });
        setWorkspacesData(null);
        toast.success("Project created successfully!");
      } catch (_) {
        toast.error("Failed to create project. Please try again.");
      }
    };

    if (workspacesData) {
      createWorkspace(workspacesData);
      setWorkspacesData(null);
    }

    if (projectData) {
      createProject(projectData);
      setProjectData(null);
    }
    if (user && !workspacesData) {
      getWorkspaces();
    }

    if (workspaces?.length === 0) {
      navigate("/");
    }

    if (user && workspaceId) {
      getProjects();
    }
  }, [
    user,
    workspacesData,
    projectData,
    workspaceId,
    dispatch,
    workspaces?.length,
    navigate,
  ]);

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

      <ScrollToTop />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onToggle={toggleSidebar}
        workspaces={workspaces}
        setWorkspacesModal={setWorkspacesModal}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-500 ${
          isSidebarCollapsed ? "ml-8 md:ml-26" : "hidden md:block md:ml-72"
        }`}
      >
        <Header currentPage={currentPage} />

        {currentPage === "home" && (
          <HomePage
            workspaces={workspaces}
            setWorkspacesModal={setWorkspacesModal}
            currentPage={currentPage}
          />
        )}

        {(currentPage === "dashboard" ||
          currentPage === "project" ||
          currentPage === "analytics" ||
          currentPage === "settings") && <Outlet />}
      </div>

      {/* Modal Root */}
      {workspacesModal && (
        <WorkspaceModal
          isOpen={workspacesModal}
          onClose={() => setWorkspacesModal(false)}
          onSubmit={createWorkspaceHandler}
        />
      )}
      {projectModal && (
        <ProjectModal isOpen={projectModal} onSubmit={createProjectHandler} />
      )}
    </div>
  );
};

export default MainPage;
