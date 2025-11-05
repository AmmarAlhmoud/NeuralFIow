import React, { useState, useRef, useEffect } from "react";
import { type Project } from "../../types/workspace";
import { NavLink } from "react-router-dom";
import { Menu, Pencil, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../../store/appSlice";
import type { RootState } from "../../store/store";
import useTimezone from "../../hooks/useTimezone";

export interface ProjectCardProps {
  project: Project;
}

const getStatusColor = (status: string) => {
  const colors = {
    active: "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    archived: "bg-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.3)]",
    completed: "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  };
  return colors[status as keyof typeof colors] || colors.active;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const dispatch = useDispatch();
  const { formatDate } = useTimezone();
  const [isMenu, setIsMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentUserRole = useSelector(
    (state: RootState) => state.app.currentUserRole
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenu(false);
      }
    };

    if (isMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenu]);

  return (
    <NavLink to={`project/${project._id}`}>
      <div className="relative min-h-48 will-change-transform will-change-shadow touch-none bg-slate-200 dark:bg-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-8px] hover:shadow-md hover:shadow-fuchsia-900">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-lg font-semibold dark:text-white text-black">
            {project.name}
          </h4>
          {(currentUserRole === "admin" || currentUserRole === "manager") && (
            <div ref={menuRef}>
              <Menu
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMenu((prev) => !prev);
                }}
                className="absolute h-5 w-5 z-20 top-2 right-2 text-black dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
              />
              {isMenu && (
                <ul
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-6 right-7 w-36 rounded-lg rounded-tr-none shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-30 overflow-hidden animate-fade-in"
                >
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(appActions.setClickProject(project));
                      dispatch(appActions.setProjectModal(true));
                      setIsMenu(false);
                    }}
                    className="flex space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <Pencil className="h-4.5 w-4.5 text-yellow-600 cursor-pointer hover:scale-110 transition-transform duration-150 ease-in-out" />
                    <span>Edit</span>
                  </li>
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(appActions.setClickProject(project));
                      dispatch(appActions.setIsConfirmationModal(true));
                      setIsMenu(false);
                    }}
                    className="flex space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-600/30 cursor-pointer transition-colors"
                  >
                    <Trash className="h-4.5 w-4.5 text-red-600 cursor-pointer hover:scale-110 transition-transform duration-150 ease-in-out" />
                    <span>Delete</span>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
          {project.description || "No description provided."}
        </p>

        <div className="inline-block mt-6 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-neon-scarlet to-neon-fuchsia text-white mb-4">
          {project.key}
        </div>

        <div className="flex items-center gap-x-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span
            title={project.createdBy?.name || "Unknown"}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
          >
            Created by:{" "}
            {project.createdBy?.name?.length &&
            project.createdBy?.name?.length > 10
              ? project.createdBy?.name.slice(0, 10) + "..."
              : project.createdBy?.name || "Unknown"}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
            {formatDate(project?.createdAt || new Date()).split("/")[0]}
          </span>
        </div>
        <div
          className={`absolute bottom-2 right-2 w-3 h-3 rounded-full ${getStatusColor(
            project.status
          )}`}
          title={
            project.status.charAt(0).toUpperCase() + project.status.slice(1)
          }
        ></div>
      </div>
    </NavLink>
  );
};

export default ProjectCard;
