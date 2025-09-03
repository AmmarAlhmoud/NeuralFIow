import React from "react";
import { type TaskCardProps } from "../../types/dashboard";

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick }) => {
  const getAvatarColor = (color: string) => {
    const colors = {
      violet: "from-violet-500 to-purple-600",
      cyan: "from-cyan-500 to-blue-600",
      green: "from-green-500 to-emerald-600",
      orange: "from-orange-500 to-red-600",
    };
    return colors[color as keyof typeof colors] || colors.violet;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-gradient-to-r from-red-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
      medium:
        "bg-gradient-to-r from-yellow-500 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      low: "bg-gradient-to-r from-green-500 to-green-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  return (
    <div
      className="bg-slate-200 dark:bg-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(139,92,246,0.2)]"
      onClick={() => onTaskClick(task)}
    >
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-lg font-semibold dark:text-white text-black">
          {task.title}
        </h4>
        <div
          className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}
        ></div>
      </div>

      <p className="dark:text-gray-400 text-gray-700 text-sm mb-4">
        {task.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {task.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              index % 2 === 0
                ? "dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30 bg-violet-500 text-white border-violet-500"
                : "dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30 bg-cyan-500 text-white border-cyan-500"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {task.progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs dark:text-gray-400 text-gray-700">Progress</span>
            <span className="text-xs text-cyan-400 font-medium">
              {task.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-violet-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {task.assignees.map((color, index) => (
            <div
              key={index}
              className={`w-8 h-8 bg-gradient-to-r ${getAvatarColor(
                color
              )} rounded-full border-2 border-gray-900 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]`}
            ></div>
          ))}
        </div>
        <div className="text-right">
          <div className="text-xs dark:text-gray-400 text-gray-700">Due {task.dueDate}</div>
          {task.isAiOptimized && (
            <div className="flex items-center space-x-1 mt-1">
              <div className="w-2 h-2 dark:bg-violet-400 bg-violet-800 rounded-full animate-pulse"></div>
              <span className="text-xs dark:text-violet-400 text-violet-800  font-medium">
                AI Optimized
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
