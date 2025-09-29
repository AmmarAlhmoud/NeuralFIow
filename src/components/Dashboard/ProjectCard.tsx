import React from "react";
import { type Project } from "../../types/workspace";
import { NavLink } from "react-router-dom";

export interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
      archived: "bg-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.3)]",
      completed: "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <NavLink to={`project/${project._id}`}>
      <div className="min-h-48 will-change-transform will-change-shadow touch-none bg-slate-200 dark:bg-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-8px] hover:shadow-md hover:shadow-fuchsia-900">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-lg font-semibold dark:text-white text-black">
            {project.name}
          </h4>
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`}
            title={
              project.status.charAt(0).toUpperCase() + project.status.slice(1)
            }
          ></div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
          {project.description || "No description provided."}
        </p>

        <div className="inline-block mt-6 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-neon-scarlet to-neon-fuchsia text-white mb-4">
          {project.key}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
            Created by: {project.createdBy?.name || "Unknown"}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
            {new Date(project.createdAt!).toLocaleDateString()}
          </span>
        </div>
      </div>
    </NavLink>
  );
};

export default ProjectCard;
