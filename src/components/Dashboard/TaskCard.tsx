import React, { memo, useMemo, useCallback, useState } from "react";
import { type Task } from "../../types/workspace";
import { isAssigneeArray } from "../Utils/helperFuns";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { appActions } from "../../store/appSlice";
import { EllipsisVertical, Trash, Pencil } from "lucide-react";
export interface TaskCardProps {
  task: Task;
}

const getPriorityColor = (priority: string) => {
  const colors = {
    critical:
      "bg-gradient-to-r from-red-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    high: "bg-gradient-to-r from-purple-600 to-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.3)]",
    medium:
      "bg-gradient-to-r from-yellow-500 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    low: "bg-gradient-to-r from-green-500 to-green-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  };
  return colors[priority as keyof typeof colors] || colors.low;
};

const TaskCard: React.FC<TaskCardProps> = memo(({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isMenu, setIsMenu] = useState(false);

  const priorityColor = useMemo(
    () => getPriorityColor(task.priority),
    [task.priority]
  );

  const formattedDueDate = useMemo(() => {
    if (!task?.dueDate) return "No due date";
    return "Due " + new Date(task.dueDate).toLocaleDateString();
  }, [task.dueDate]);

  const assigneeList = useMemo(() => {
    if (!isAssigneeArray(task.assignees)) return [];
    return task.assignees;
  }, [task.assignees]);

  const hasEstimate = useMemo(
    () => task.estimate !== undefined,
    [task.estimate]
  );

  const hasAI = useMemo(() => !!task?.ai, [task.ai]);

  // Memoize click handler
  const handleCardClick = useCallback(() => {
    dispatch(appActions.setClickTask(task));
    dispatch(appActions.setTaskDrawer(true));
  }, [dispatch, task]);

  // Memoize tag rendering
  const tagElements = useMemo(
    () =>
      task.tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            index % 2 === 0
              ? "dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30 bg-violet-500 text-white border-violet-500"
              : "dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30 bg-cyan-500 text-white border-cyan-500"
          }`}
        >
          {tag}
        </span>
      )),
    [task.tags]
  );

  // Memoize assignee avatars
  const assigneeAvatars = useMemo(
    () =>
      assigneeList.map((assignee, index) => (
        <img
          key={assignee._id || assignee.email || index}
          className="w-8 h-8 bg-gradient-to-r rounded-full border-2 border-gray-900 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          src={assignee.avatarUrl}
          alt={`${assignee.name[0]} avatar`}
        />
      )),
    [assigneeList]
  );

  return (
    <div
      className="relative z-10 will-change-transform will-change-shadow touch-none bg-slate-200 dark:bg-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:translate-y-[-8px] hover:shadow-md hover:shadow-fuchsia-900"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-lg font-semibold dark:text-white text-black">
          {task.title}
        </h4>
        <div
          className={`absolute bottom-2 right-2 w-3 h-3 rounded-full ${priorityColor}`}
          title={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        ></div>
        <EllipsisVertical
          onClick={(e) => {
            e.stopPropagation();
            setIsMenu((prev) => !prev);
          }}
          className="absolute z-20 top-2 right-0.5 text-black dark:text-white cursor-pointer hover:scale-110 transition-transform duration-150 ease-in-out"
        />

        {isMenu && (
          <ul className="absolute top-5 right-5 w-36 rounded-lg rounded-tr-none shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-30 overflow-hidden animate-fade-in">
            <li
              onClick={(e) => {
                e.stopPropagation();
                dispatch(appActions.setClickTask(task));
                dispatch(appActions.setTaskModal(true));
                setIsMenu((prev) => !prev);
              }}
              className="flex space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <Pencil className="h-4.5 w-4.5 text-yellow-600  cursor-pointer hover:scale-110 transition-transform duration-150 ease-in-out" />
              <span>Edit</span>
            </li>
            <li
              onClick={(e) => {
                e.stopPropagation();
                dispatch(appActions.setClickTask(task));
                dispatch(appActions.setConfirmationModal(true));
                setIsMenu((prev) => !prev);
              }}
              className="flex space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-600/30 cursor-pointer transition-colors"
            >
              <Trash className="h-4.5 w-4.5 text-red-600 cursor-pointer hover:scale-110 transition-transform duration-150 ease-in-out" />
              <span>Delete</span>
            </li>
          </ul>
        )}
      </div>

      {task.description && (
        <p className="dark:text-gray-400 text-gray-700 text-sm mb-4">
          {task.description}
        </p>
      )}

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">{tagElements}</div>
      )}

      {hasEstimate && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs dark:text-gray-400 text-gray-700">
              estimate
            </span>
            <span className="text-xs text-cyan-400 font-medium">
              {task.estimate}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-violet-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${task.estimate}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {assigneeList.length > 0 ? (
            assigneeAvatars
          ) : (
            <div className="text-xs dark:text-gray-400 text-gray-700">
              No assignees
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-xs dark:text-gray-400 text-gray-700">
            {formattedDueDate}
          </div>
          {hasAI && (
            <div className="flex items-center space-x-1 mt-1">
              <div className="w-2 h-2 dark:bg-violet-400 bg-violet-800 rounded-full animate-pulse"></div>
              <span className="text-xs dark:text-violet-400 text-violet-800 font-medium">
                AI Optimized
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default TaskCard;
