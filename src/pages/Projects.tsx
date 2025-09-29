import React, { useEffect, useState } from "react";
import { type Task } from "../types/workspace";
import TaskList from "../components/Dashboard/TaskList";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";
import { TaskModal } from "../components/Dashboard/TaskModal";
import toast from "react-hot-toast";
import TaskDrawer from "../components/Dashboard/TaskDrawer";

const ProjectPage: React.FC = () => {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const { workspaceId, projectId } = useParams();

  const isTaskModal = useSelector((state: RootState) => state.app.isTaskModal);
  const selectedTask = useSelector((state: RootState) => state.app.clickTask);
  const isTaskDrawer = useSelector(
    (state: RootState) => state.app.isTaskDrawer
  );
  const [tasks, setTasks] = useState<Task[] | undefined>([]);
  const [taskData, setTaskData] = useState<Task | null>();
  const [updateTaskData, setUpdateTaskData] = useState<Task | null>();

  const createTaskHandler = (formData: Task) => {
    if (!user) {
      toast.error("Failed to create task try again");
      return;
    }

    if (projectId) {
      const data: Task = { ...formData, projectId };
      setTaskData(data);
      return;
    }

    toast.error("Failed to create Task. Please try again.");
  };

  // Mock Data
  // const tasks: Task[] = [
  //   {
  //     id: "1",
  //     title: "AI Content Strategy",
  //     description:
  //       "Develop comprehensive AI-driven content strategy for Q1 2025 marketing campaigns",
  //     status: "todo",
  //     priority: "high",
  //     tags: ["Strategy", "AI-Generated"],
  //     assignees: ["violet", "cyan", "green"],
  //     dueDate: "Dec 28",
  //     isAiOptimized: true,
  //   },
  //   {
  //     id: "2",
  //     title: "User Research Analysis",
  //     description:
  //       "Analyze user feedback and behavioral data to identify key improvement areas",
  //     status: "todo",
  //     priority: "medium",
  //     tags: ["Research", "Data Analysis"],
  //     assignees: ["green", "orange"],
  //     dueDate: "Jan 5",
  //   },
  //   {
  //     id: "3",
  //     title: "Neural API Integration",
  //     description:
  //       "Integrate advanced AI models for automated task prioritization and workflow optimization",
  //     status: "inprogress",
  //     priority: "high",
  //     tags: ["Development", "AI/ML"],
  //     assignees: ["cyan", "violet"],
  //     dueDate: "Dec 30",
  //     progress: 73,
  //     isAiOptimized: true,
  //   },
  //   {
  //     id: "4",
  //     title: "Dashboard UI Redesign",
  //     description:
  //       "Complete redesign of the main dashboard with modern glassmorphism UI",
  //     status: "done",
  //     priority: "low",
  //     tags: ["Design", "Completed"],
  //     assignees: ["violet"],
  //     dueDate: "Completed Dec 20",
  //   },
  // ];

  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/tasks/by-project/${projectId}?workspaceId=${workspaceId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log(data);
        setTasks(data.data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };
    const createTask = async (task: Task) => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/tasks?workspaceId=${workspaceId}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
          }
        );
        setTaskData(null);
        toast.success("Task created successfully!");
      } catch (_) {
        toast.error("Failed to create Task. Please try again.");
      }
    };

    if (taskData) {
      createTask(taskData);
      setTaskData(null);
    }

    if (user) {
      getTasks();
    }
  }, [user, dispatch, taskData, projectId, workspaceId]);

  return (
    <>
      <TaskList tasks={tasks} />
      {isTaskModal && (
        <TaskModal
          isOpen={isTaskModal}
          onSubmit={createTaskHandler}
          initialData={updateTaskData}
        />
      )}
      {isTaskDrawer && <TaskDrawer task={selectedTask} isOpen={isTaskDrawer} />}
    </>
  );
};

export default ProjectPage;
