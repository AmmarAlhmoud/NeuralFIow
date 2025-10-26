import React from "react";
import { NavLink } from "react-router-dom";
import { type SearchItemData } from "../../types/search";

interface SearchItemProps {
  data: SearchItemData;
  index: number;
}

const SearchItem: React.FC<SearchItemProps> = ({ data, index }) => {
  const getColorClasses = (index: number) => {
    const colors = [
      "border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20",
      "border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/20",
      "border-l-pink-500 bg-pink-50/50 dark:bg-pink-900/20",
      "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/20",
      "border-l-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20",
    ];
    return colors[index % colors.length];
  };

  // Workspace item rendering
  if (data.type === "workspace") {
    return (
      <li>
        <NavLink
          to={`/workspace/${data._id}`}
          className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${getColorClasses(
            index
          )} hover:scale-[1.02] transition-all duration-200 group`}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {data.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              {data.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {data.memberCount} {data.memberCount === 1 ? "member" : "members"}
            </p>
          </div>
          <div className="flex-shrink-0">
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </NavLink>
      </li>
    );
  }
  // Project item rendering
  if (data.type === "project") {
    const statusColors = {
      active:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      completed:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      archived: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };

    return (
      <li>
        <NavLink
          to={`/workspace/${data.workspaceId}/project/${data._id}`}
          className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${getColorClasses(
            index
          )} hover:scale-[1.02] transition-all duration-200 group`}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
              {data.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {data.workspaceName}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  statusColors[data.status]
                }`}
              >
                {data.status}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {data.taskCount} {data.taskCount === 1 ? "task" : "tasks"}
              </span>
            </div>
          </div>
        </NavLink>
      </li>
    );
  }
  // Task item rendering
  if (data.type === "task") {
    const priorityConfig = {
      low: {
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
        icon: "▼",
      },
      medium: {
        color:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: "■",
      },
      high: {
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        icon: "▲",
      },
    };

    const isOverdue =
      data.dueDate &&
      new Date(data.dueDate) < new Date() &&
      data.status !== "done";

    return (
      <li>
        <NavLink
          to={`/workspace/${data.workspaceId}/project/${data.projectId}/task/${data._id}`}
          className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${getColorClasses(
            index
          )} hover:scale-[1.02] transition-all duration-200 group ${
            data.status === "done" ? "opacity-60" : ""
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                data.status === "done"
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 dark:border-gray-600 group-hover:border-indigo-500"
              }`}
            >
              {data.status === "done" && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={`font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition ${
                data.status === "done" ? "line-through" : ""
              }`}
            >
              {data.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {data.projectName}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                  priorityConfig[data.priority].color
                }`}
              >
                <span>{priorityConfig[data.priority].icon}</span>
                {data.priority}
              </span>
              {data.dueDate && (
                <span
                  className={`text-xs ${
                    isOverdue
                      ? "text-red-600 dark:text-red-400 font-semibold"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {isOverdue ? "⚠ " : ""}
                  {new Date(data.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </NavLink>
      </li>
    );
  }

  return null;
};

export default SearchItem;
