import React, { memo, useMemo, useCallback, useState } from "react";
import { type Task } from "../../types/workspace";
import { isAssigneeArray } from "../../utils/helperFuns";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { appActions } from "../../store/appSlice";
import { Menu, Trash, Pencil, Clock } from "lucide-react";
import useTimezone from "../../hooks/useTimezone";
import { useNavigate } from "react-router-dom";
import { getPriorityColor } from "../../utils/helperFuns";
export interface TaskCardProps {
  task: Task;
}

const formatEstimate = (hours: number): string => {
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${days}d`;
  }
  return `${hours}h`;
};

const TaskCard: React.FC<TaskCardProps> = memo(({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isMenu, setIsMenu] = useState(false);
  const { formatDate } = useTimezone();

  const priorityColor = useMemo(
    () => getPriorityColor(task.priority),
    [task.priority]
  );

  const formattedDueDate = useMemo(() => {
    if (!task?.dueDate) return "No due date";
    return "Due " + formatDate(task.dueDate);
  }, [formatDate, task.dueDate]);

  const assigneeList = useMemo(() => {
    if (!isAssigneeArray(task.assignees)) return [];
    return task.assignees;
  }, [task.assignees]);

  const hasEstimate = useMemo(
    () => task.estimate !== undefined,
    [task.estimate]
  );

  const formattedEstimate = useMemo(() => {
    if (!hasEstimate) return null;
    return formatEstimate(task.estimate!);
  }, [hasEstimate, task.estimate]);

  const hasProgress = useMemo(
    () => task.progress !== undefined,
    [task.progress]
  );

  const hasAI = useMemo(() => !!task?.ai, [task.ai]);

  // Memoize click handler
  const handleCardClick = useCallback(() => {
    dispatch(appActions.setClickTask(task));
    dispatch(appActions.setCurrentTaskId(task._id!));
    dispatch(appActions.setTaskDrawer(true));
    navigate("task/" + task._id);
  }, [dispatch, navigate, task]);

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
          src={assignee.avatarURL}
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
        <Menu
          onClick={(e) => {
            e.stopPropagation();
            setIsMenu((prev) => !prev);
          }}
          className="absolute h-5 w-5 z-20 top-2 right-2 text-black dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
        />

        {isMenu && (
          <ul className="absolute top-6 right-7 w-36 rounded-lg rounded-tr-none shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-30 overflow-hidden animate-fade-in">
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
                dispatch(appActions.setIsConfirmationModal(true));
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

      {hasProgress && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs dark:text-gray-400 text-gray-700">
              Progress
            </span>
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

      {hasEstimate && (
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-3 w-3 dark:text-blue-400 text-blue-600" />
          <span className="text-xs dark:text-blue-400 text-blue-600 font-medium">
            Est: {formattedEstimate}
          </span>
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
