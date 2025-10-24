import React from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { type Task } from "../../types/workspace";
import { Button } from "../ui/Button";
import Loading from "../ui/Loading";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../../store/appSlice";
import HoverDisabler from "../ui/HoverDisabler";
import type { RootState } from "../../store/store";

interface TaskListProps {
  tasks: Task[] | undefined;
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const dispatch = useDispatch();
  const currentUserRole = useSelector(
    (state: RootState) => state.app.currentUserRole
  );

  const columns = [
    { id: "todo", title: "To Do", color: "bg-green-500" },
    { id: "in_progress", title: "In Progress", color: "bg-gray-400" },
    { id: "done", title: "Done", color: "bg-cyan-500" },
  ];

  let tasksList: React.ReactNode;

  if (tasks === undefined) {
    tasksList = (
      <div className="text-sm text-center min-h-38 mt-36">
        <Loading />
      </div>
    );
  }

  if (tasks !== undefined && tasks?.length === 0) {
    tasksList = (
      <div className="min-h-66 mt-50 text-md font-semibold text-center">
        No tasks available
      </div>
    );
  }

  if (tasks !== undefined && tasks?.length > 0) {
    tasksList = (
      <HoverDisabler>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-109 max-h-109 overflow-y-auto custom-scrollbar mt-8 px-2">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (tasks) => tasks.status === column.id
            );
            const count = columnTasks.length;

            return (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 ${column.color} rounded-full ${
                        column.id === "inprogress" ? "animate-pulse" : ""
                      }`}
                    ></div>
                    <h3 className="text-lg font-semibold dark:text-gray-300 text-black">
                      {column.title}
                    </h3>
                  </div>
                  <span
                    className={`bg-${column.color.split("-")[0]}-700 text-${
                      column.color
                    } px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {count}
                  </span>
                </div>

                <div className="space-y-4">
                  {tasks
                    .filter((task) => task.status === column.id)
                    .sort((a, b) => {
                      const orderA = a.order ?? 6;
                      const orderB = b.order ?? 6;

                      // Tasks with order 6 always go last
                      if (orderA === 6 && orderB !== 6) return 1;
                      if (orderA !== 6 && orderB === 6) return -1;

                      return orderA - orderB; // ascending for others
                    })
                    .map((task) => (
                      <TaskCard key={task._id} task={task} />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </HoverDisabler>
    );
  }

  return (
    <div className="px-6 pb-6">
      <div className="glassmorphic rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r dark:from-white dark:to-gray-300 from-black to-gray-300 bg-clip-text text-transparent mb-2">
              Neural Tasks Board
            </h2>
            <p className="dark:text-gray-400 text-gray-700">
              AI-powered task management with intelligent prioritization
            </p>
          </div>
          {(currentUserRole === "admin" || currentUserRole === "manager") && (
            <Button
              type="button"
              variant="gradient"
              className="flex space-x-2 px-4 py-0"
              onClick={() => dispatch(appActions.setTaskModal(true))}
            >
              <Plus />
              <span>Create Task</span>
            </Button>
          )}
        </div>

        {tasksList}
      </div>
    </div>
  );
};

export default TaskList;
