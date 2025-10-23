import React, { use, useEffect, useState } from "react";
import { type Task, type Workspace } from "../types/workspace";
import TaskList from "../components/Dashboard/TaskList";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";
import { TaskModal } from "../components/Dashboard/TaskModal";
import toast from "react-hot-toast";
import TaskDrawer from "../components/Dashboard/TaskDrawer";
import { appActions } from "../store/appSlice";
import { ConfirmationModal } from "../components/ui/ConfirmationModal";
import { socket } from "../utils/socket";
import { useAIResults } from "../hooks/useAIResults";

const ProjectPage: React.FC = () => {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const { workspaceId, projectId, taskId } = useParams();

  const [workspace, setWorkspace] = useState<Workspace | null>();

  const isTaskModal = useSelector((state: RootState) => state.app.isTaskModal);
  const selectedTask = useSelector((state: RootState) => state.app.clickTask);
  const isTaskDrawer = useSelector(
    (state: RootState) => state.app.isTaskDrawer
  );
  const isConfirmationModal = useSelector(
    (state: RootState) => state.app.isConfirmationModal
  );
  const currentTaskId = useSelector(
    (state: RootState) => state.app.currentTaskId
  );
  const [tasks, setTasks] = useState<Task[] | undefined>([]);
  const [taskData, setTaskData] = useState<Task | null>();
  const [updateTaskData, setUpdateTaskData] = useState<Task | null>();
  const [deleteAction, setDeleteAction] = useState<boolean>(false);

  const taskInfoHandler = (formData: Task, type: "create" | "update") => {
    if (!user) {
      toast.error("Failed to create task try again");
      return;
    }

    let data: Task;

    if (projectId && type === "create") {
      data = { ...formData, projectId };
      setTaskData(data);
      return;
    }

    if (projectId && type === "update") {
      data = { ...formData, projectId };
      setUpdateTaskData(data);
      return;
    }

    if (projectId && type === "create") {
      toast.error("Failed to create Task. Please try again.");
    } else {
      toast.error("Failed to update Task. Please try again.");
    }
  };

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
    const updateTask = async (task: Task) => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/tasks/${
            task._id
          }?workspaceId=${workspaceId}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
          }
        );
        dispatch(appActions.setClickTask(null));
        toast.success("Task updated successfully!");
      } catch (_) {
        toast.error("Failed to update Task. Please try again.");
      }
    };
    const deleteTask = async (task: Task) => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/tasks/${
            task._id
          }?workspaceId=${workspaceId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        dispatch(appActions.setClickTask(null));
        toast.success("Task deleted successfully!");
      } catch (_) {
        toast.error("Failed to deleted Task. Please try again.");
      }
    };
    const getWorkspace = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setWorkspace(data.data);
      } catch (error) {
        console.error("Error fetching workspace:", error);
      }
    };

    if (taskData) {
      createTask(taskData);
      setTaskData(null);
    }

    if (updateTaskData) {
      updateTask(updateTaskData);
      setUpdateTaskData(null);
    }

    if (selectedTask && deleteAction) {
      deleteTask(selectedTask);
      setDeleteAction(false);
    }

    if (user) {
      getTasks();
      getWorkspace();
    }
  }, [
    user,
    dispatch,
    taskData,
    projectId,
    workspaceId,
    updateTaskData,
    selectedTask,
    deleteAction,
  ]);

  // Subscribe to project room
  useEffect(() => {
    if (projectId) {
      socket.emit("subscribe", { type: "project", id: projectId });
    }
  }, [projectId]);

  useEffect(() => {
    if (currentTaskId) {
      dispatch(appActions.setTaskDrawer(true));
    }
  }, [currentTaskId, dispatch]);

  // Listen for AI results
  useAIResults(currentTaskId, (data) => {
    switch (data.type) {
      case "summary":
        dispatch(
          appActions.setClickTask({
            ...selectedTask!,
            ai: {
              ...selectedTask?.ai,
              summary: data.data.summary,
              lastProcessed: data.data.lastProcessed,
            },
          })
        );
        break;

      case "subtasks":
        dispatch(
          appActions.setClickTask({
            ...selectedTask!,
            ai: { ...selectedTask!.ai, suggestedSubtasks: data.data.subtasks },
          })
        );
        break;

      case "priority":
        dispatch(
          appActions.setClickTask({
            ...selectedTask!,
            ai: {
              ...selectedTask!.ai,
              suggestedPriority: data.data.priority as
                | "low"
                | "medium"
                | "high"
                | "critical",
              priorityReason: data.data.reason,
            },
          })
        );
        break;
    }
  });

  return (
    <>
      <TaskList tasks={tasks} />
      {isTaskModal && (
        <TaskModal
          isOpen={isTaskModal}
          onSubmit={taskInfoHandler}
          initialData={selectedTask}
          workspace={workspace || null}
        />
      )}
      {(isTaskDrawer || taskId) && (
        <TaskDrawer isOpen={taskId ? true : isTaskDrawer} />
      )}
      {isConfirmationModal && (
        <ConfirmationModal
          isOpen={isConfirmationModal}
          action={() => setDeleteAction(true)}
          title={"Confirmation"}
          message={"Are you sure you want to delete this task?"}
          type="task"
        />
      )}
    </>
  );
};

export default ProjectPage;
