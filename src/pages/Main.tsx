import React, { useState, useEffect } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../components/Dashboard/Sidebar";
import ScrollToTop from "../components/UI/ScrollToTop";
import Header from "../components/Dashboard/Header";
import HomePage from "./Home";
import type { PageType } from "../types/dashboard";
import type { Project, TeamMember, Workspace } from "../types/workspace";
import { WorkspaceModal } from "../components/Dashboard/WorkspaceModal";
import { useAuthContext } from "../hooks/useAuth";
import { Outlet } from "react-router-dom";
import { ProjectModal } from "../components/Dashboard/ProjectModal";
import type { RootState } from "../store/store";
import { appActions } from "../store/appSlice";
import { ConfirmationModal } from "../components/UI/ConfirmationModal";
import type { Role } from "../types/auth";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { workspaceId, projectId } = useParams();
  const { user } = useAuthContext();
  const workspaceLoaded = useRouteLoaderData("workspace");
  const analyticsLoaderData = useRouteLoaderData("analytics");
  const settingsLoaderData = useRouteLoaderData("settings");
  const projectsLoaderData = useRouteLoaderData("projects");
  const taskLoaderData = useRouteLoaderData("task");

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [workspacesModal, setWorkspacesModal] = useState(false);
  const [workspacesData, setWorkspacesData] = useState<Workspace | null>();
  const [projectData, setProjectData] = useState<Project | null>();
  const [updateProjectData, setUpdateProjectData] = useState<Project | null>();
  const [deleteAction, setDeleteAction] = useState<boolean>(false);

  const projectModal = useSelector(
    (state: RootState) => state.app.projectModal
  );
  const selectedProject = useSelector(
    (state: RootState) => state.app.clickProject
  );
  const isConfirmationModal = useSelector(
    (state: RootState) => state.app.isConfirmationModal
  );

  const getCurrentPage = (): PageType => {
    if (location.pathname.includes("analytics")) return "analytics";
    if (location.pathname.includes("settings")) return "settings";
    if (location.pathname.includes("profile")) return "profile";
    if (location.pathname.includes("notifications")) return "notifications";
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
      case "profile":
        navigate(`/profile`);
        break;
      case "notifications":
        navigate(`/notifications`);
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

  const projectInfoHandler = (formData: Project, type: "create" | "update") => {
    if (!user) {
      toast.error("Failed to create project try again");
      return;
    }

    if (workspaceId && type === "create") {
      setProjectData(formData);
      return;
    }

    if (workspaceId && type === "update") {
      setUpdateProjectData(formData);
      return;
    }

    if (workspaceId && type === "create") {
      toast.error("Failed to create Project. Please try again.");
    } else {
      toast.error("Failed to update Project. Please try again.");
    }
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
    const updateProject = async (project: Project) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/projects/${project._id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(project),
          }
        );

        const data = await res.json();
        if (res.status === 404 || res.status === 400 || res.status === 403) {
          toast.error(data.message);
          return;
        }

        dispatch(appActions.setClickProject(null));
        toast.success("Project updated successfully!");
      } catch (_) {
        toast.error("Failed to update project. Please try again.");
      }
    };
    const deleteProject = async () => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/projects/${
            selectedProject?._id
          }?workspaceId=${workspaceId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        dispatch(appActions.setClickProject(null));
        toast.success("Project deleted successfully!");
      } catch (_) {
        toast.error("Failed to delete project. Please try again.");
      }
    };
    const getAIStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}/ai-stats`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success) {
          dispatch(appActions.setAIStats(data.data));
        }
      } catch (error) {
        console.error("Error fetching ai stats:", error);
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

    if (updateProjectData) {
      updateProject(updateProjectData);
      setUpdateProjectData(null);
    }

    if (deleteAction && selectedProject) {
      deleteProject();
      setDeleteAction(false);
    }

    if (user && !workspacesData) {
      getWorkspaces();
    }

    if (workspaces?.length === 0 && currentPage === "dashboard") {
      navigate("/");
    }

    if (user && workspaceId) {
      getProjects();
      if (
        workspaceLoaded?.userRole === "admin" ||
        workspaceLoaded?.userRole === "manager" ||
        analyticsLoaderData?.userRole === "admin" ||
        analyticsLoaderData?.userRole === "manager"
      ) {
        getAIStats();
      }
    }

    if (
      analyticsLoaderData ||
      workspaceLoaded ||
      settingsLoaderData ||
      projectsLoaderData ||
      taskLoaderData
    ) {
      if (workspaceLoaded) {
        dispatch(
          appActions.setCurrentUserRole(workspaceLoaded?.userRole as Role) ??
            "viewer"
        );
      }

      if (analyticsLoaderData) {
        dispatch(
          appActions.setCurrentUserRole(
            analyticsLoaderData?.userRole as Role
          ) ?? "viewer"
        );
      }
      if (settingsLoaderData) {
        dispatch(
          appActions.setCurrentUserRole(settingsLoaderData?.userRole as Role) ??
            "viewer"
        );
      }
      if (projectsLoaderData) {
        dispatch(
          appActions.setCurrentUserRole(projectsLoaderData?.userRole as Role) ??
            "viewer"
        );
      }
      if (taskLoaderData) {
        dispatch(
          appActions.setCurrentUserRole(taskLoaderData?.userRole as Role) ??
            "viewer"
        );
      }
    }
  }, [
    user,
    workspacesData,
    projectData,
    workspaceId,
    dispatch,
    navigate,
    workspaces?.length,
    currentPage,
    updateProjectData,
    deleteAction,
    selectedProject,
    analyticsLoaderData,
    workspaceLoaded,
    settingsLoaderData,
    taskLoaderData,
    projectsLoaderData,
  ]);

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-all duration-500 text-gray-900 dark:text-gray-100">
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

      <div className="fixed inset-0 bg-gradient-to-br from-[#b74fd6]/10 via-transparent to-[#d64f4f]/10 pointer-events-none dark:from-violet-500/10 dark:to-cyan-500/10"></div>

      <ScrollToTop />

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onToggle={toggleSidebar}
        workspaces={workspaces}
        setWorkspacesModal={setWorkspacesModal}
      />

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
          currentPage === "profile" ||
          currentPage === "notifications" ||
          currentPage === "settings") && <Outlet />}
      </div>

      {workspacesModal && (
        <WorkspaceModal
          isOpen={workspacesModal}
          onClose={() => setWorkspacesModal(false)}
          onSubmit={createWorkspaceHandler}
        />
      )}
      {projectModal && (
        <ProjectModal
          initialData={selectedProject}
          isOpen={projectModal}
          onSubmit={projectInfoHandler}
        />
      )}
      {isConfirmationModal && selectedProject && (
        <ConfirmationModal
          isOpen={isConfirmationModal}
          action={() => setDeleteAction(true)}
          title={"Confirmation"}
          message={
            "This action will permanently delete the project and all its tasks. This cannot be undone."
          }
          type="project"
        />
      )}
    </div>
  );
};

export default MainPage;
