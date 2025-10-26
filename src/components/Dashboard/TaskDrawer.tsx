import React, { useEffect, useRef, useState, type FormEvent } from "react";
import { X, FileText, Plus, Zap } from "lucide-react";
import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../../store/appSlice";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import NuralAssistant from "./NuralAssistant";
import CommentItem from "./CommentItem";
import { Button } from "../UI/Button";
import type { Comment } from "../../types/workspace";

interface TaskDrawerProps {
  isOpen: boolean | null;
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({ isOpen }) => {
  const { workspaceId, projectId, taskId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const selectedTask = useSelector((state: RootState) => state.app.clickTask);
  const postCommentRef = useRef<HTMLTextAreaElement>(null);
  const [commnets, setComments] = useState<Comment[] | null>();
  const tryFetch = useSelector((state: RootState) => state.app.tryFetch);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
      dispatch(appActions.setTaskDrawer(false));
    };
  }, [dispatch, isOpen, navigate, projectId, taskId, workspaceId]);

  useEffect(() => {
    const getTask = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/tasks/by-project/${projectId}/task/${taskId}?workspaceId=${workspaceId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        dispatch(appActions.setClickTask(data.data));
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };
    const getComments = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/comments/by-task/${taskId}?workspaceId=${workspaceId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setComments(data.data);
        dispatch(appActions.setTryFetch(false));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (taskId || tryFetch) {
      getTask();
      getComments();
    }
  }, [dispatch, projectId, taskId, tryFetch, workspaceId]);

  const handleGenerateSummary = async () => {
    if (!taskId) return;
    try {
      await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/tasks/${taskId}/ai/summarize?workspaceId=${workspaceId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      toast.loading("🤖 Generating summary...", { id: "ai-summary" });
    } catch (_) {
      toast.error("Failed to queue AI summary");
    }
  };

  const handleGenerateٍSubtasks = async () => {
    if (!taskId) return;
    try {
      await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/tasks/${taskId}/ai/subtasks?workspaceId=${workspaceId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      toast.loading("🤖 Generating subtasks...", { id: "ai-subtasks" });
    } catch (_) {
      toast.error("Failed to queue AI subtasks");
    }
  };

  const handleGeneratePriority = async () => {
    if (!taskId) return;
    try {
      await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/tasks/${taskId}/ai/priority?workspaceId=${workspaceId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      toast.loading("🤖 Generating priority...", { id: "ai-priority" });
    } catch (_) {
      toast.error("Failed to queue AI priority");
    }
  };

  const postCommentHandler = (e: FormEvent) => {
    e.preventDefault();

    const data: Comment = {
      taskId: taskId || "",
      body: postCommentRef?.current?.value || "",
      createdAt: new Date().toISOString(),
    };

    if (data.body?.length === 0) {
      toast.error("Please enter a message before posting your comment.");
      return;
    }

    dispatch(appActions.setPostComment(data));
    if (postCommentRef.current) {
      postCommentRef.current.value = "";
    }
  };

  if (!selectedTask) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
        onClick={() => {
          dispatch(appActions.setTaskDrawer(false));
          dispatch(appActions.setClickTask(null));
          navigate(`/workspace/${workspaceId}/project/${projectId}`, {
            replace: true,
          });
        }}
      ></div>
      <div
        className={`fixed right-0 top-0 h-full w-105 glassmorphic z-40 transform transition-transform duration-400 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold dark:text-white text-black">
              {selectedTask.title}
            </h2>
            <button
              onClick={() => {
                dispatch(appActions.setTaskDrawer(false));
                dispatch(appActions.setClickTask(null));
                navigate(`/workspace/${workspaceId}/project/${projectId}`, {
                  replace: true,
                });
              }}
              className="dark:text-gray-400 dark:hover:text-white text-gray-700 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Task Details */}
            <div>
              <h3 className="font-semibold dark:text-white text-black mb-4">
                Description
              </h3>
              <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-black/10">
                <p className="dark:text-gray-300 text-gray-700 leading-relaxed">
                  {selectedTask.description || "No description available"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold dark:text-white text-gray-700 mb-4">
                AI Neural Assistant
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full relative overflow-hidden bg-gradient-to-r dark:from-violet-600/20 dark:to-violet-600/20 from-violet-600 to-violet-600 border border-violet-500/30 dark:text-violet-300 text-white px-4 py-3 rounded-xl font-medium hover:bg-violet-600/30 transition-all duration-300 hover:scale-105 group"
                  onClick={() => handleGenerateSummary()}
                >
                  <span className="flex items-center space-x-3">
                    <FileText className="w-5 h-5" />
                    <span>AI Summarize Task</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>

                <button
                  className="w-full relative overflow-hidden bg-gradient-to-r dark:from-cyan-600/20 dark:to-cyan-600/20 from-cyan-600 to-cyan-600 border border-cyan-500/30 dark:text-cyan-300 text-white px-4 py-3 rounded-xl font-medium hover:bg-cyan-600/30 transition-all duration-300 hover:scale-105 group"
                  onClick={() => handleGenerateٍSubtasks()}
                >
                  <span className="flex items-center space-x-3">
                    <Plus className="w-5 h-5" />
                    <span>Generate Subtasks</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>

                <button
                  className="w-full relative overflow-hidden bg-gradient-to-r dark:from-orange-600/20 from-orange-600 dark:to-orange-600/20 to-orange-600 border border-orange-500/30 dark:text-orange-300 text-white px-4 py-3 rounded-xl font-medium hover:bg-orange-600/30 transition-all duration-300 hover:scale-105 group"
                  onClick={() => handleGeneratePriority()}
                >
                  <span className="flex items-center space-x-3">
                    <Zap className="w-5 h-5" />
                    <span>Suggest Priority</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold dark:text-white text-black mb-4">
                Neural Comments
              </h3>

              <div className="space-y-4">
                {selectedTask.ai?.summary && (
                  <NuralAssistant
                    type="summary"
                    content={selectedTask.ai?.summary || ""}
                    lastProcessed={selectedTask.ai?.lastProcessed}
                  />
                )}
                {selectedTask.ai?.suggestedPriority && (
                  <NuralAssistant
                    type="priority"
                    content={
                      selectedTask.ai?.suggestedPriority[0].toUpperCase() +
                        selectedTask.ai?.suggestedPriority
                          .slice(1)
                          .toLowerCase() || ""
                    }
                    reason={selectedTask.ai?.priorityReason}
                    lastProcessed={selectedTask.ai?.lastProcessed}
                  />
                )}
                {selectedTask.ai?.suggestedSubtasks && (
                  <NuralAssistant
                    type="subtasks"
                    content={selectedTask.ai?.suggestedSubtasks}
                    lastProcessed={selectedTask.ai?.lastProcessed}
                  />
                )}
              </div>

              {commnets?.map((comment, index) => (
                <CommentItem
                  key={comment?._id}
                  comment={comment}
                  index={index}
                />
              ))}

              <form onSubmit={postCommentHandler} className="mt-6">
                <textarea
                  ref={postCommentRef}
                  name="comment"
                  placeholder="Add a neural comment..."
                  className="w-full px-4 py-3 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl dark:text-white text-black placeholder-gray-400 resize-none focus:outline-none input-glow"
                  rows={3}
                ></textarea>
                <Button type="submit" variant="gradient" className="mt-2 !py-2">
                  Post Comment
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDrawer;
