import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { TextQuote } from "lucide-react";
import type { Workspace } from "../../types/workspace";
import type { PageType } from "../../types/dashboard";

interface WorkspaceItemProps {
  workspace: Workspace;
  currentPage: PageType;
}

const WorkspaceItem: React.FC<WorkspaceItemProps> = ({
  workspace,
  currentPage,
}) => {
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

  const { workspaceId } = useParams();

  let container: React.ReactNode;
  if (currentPage === "home") {
    container = (
      <>
        <div
          className="w-12 h-12 bg-gradient-to-r rounded-lg flex items-center justify-center"
          style={{
            background: getGradientFromColor(workspace.color!),
          }}
        >
          <span className="dark:text-white text-black font-bold text-sm">
            {workspace.name[0].toUpperCase()}
          </span>
        </div>
        <div className="flex-1 flex space-x-14">
          <div className="flex flex-1 flex-col space-x-4">
            <div className="text-md font-medium dark:text-gray-300 text-gray-700 dark:group-hover:text-white group-hover:text-black">
              {workspace.name}
            </div>
            <div className="text-gray-500 text-sm">
              {workspace.members?.length} members
            </div>
          </div>
          <div className="flex flex-col flex-2">
            {workspace.description && (
              <div className="self-start dark:text-gray-300 text-gray-700 text-md mt-4 flex justify-center gap-x-2">
                <TextQuote className="h-6 w-6 text-black dark:text-white" />
                <p>{workspace.description}</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
  if (currentPage !== "home") {
    container = (
      <>
        <div
          className="w-8 h-8 bg-gradient-to-r rounded-lg flex items-center justify-center"
          style={{
            background: getGradientFromColor(workspace.color!),
          }}
        >
          <span className="dark:text-white text-black font-bold text-sm">
            {workspace.name[0].toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium dark:text-gray-300  text-gray-700 dark:group-hover:text-white group-hover:text-black ">
            {workspace.name}
          </div>
          <div className="text-gray-500 text-xs">
            {workspace.members?.length} members
          </div>
        </div>
      </>
    );
  }

  return (
    <NavLink to={`/workspace/${workspace._id}`}>
      <div
        key={workspace._id}
        className={`will-change-transform will-change-shadow touch-none flex items-center space-x-3 p-2.5 rounded-lg hover:bg-white/5 cursor-pointer group transition-all ${
          workspace._id === workspaceId
            ? "bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 neon-glow"
            : "dark:hover:bg-white/5 dark:hover:border-white/10 hover:bg-black/5 hover:border-black/10 border border-transparent"
        }`}
      >
        {container}
      </div>
    </NavLink>
  );
};

export default WorkspaceItem;
