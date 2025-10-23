import { useEffect } from "react";
import { socket } from "../utils/socket";
import type { AICompletedData } from "../types/workspace";

export function useAIResults(
  taskId: string | null,
  onComplete: (data: AICompletedData) => void
) {
  useEffect(() => {
    if (!taskId) return;

    const handleAIComplete = (data: AICompletedData) => {
      if (data.taskId === taskId) {
        onComplete(data);
      }
    };

    socket.on("ai:completed", handleAIComplete);

    return () => {
      socket.off("ai:completed", handleAIComplete);
    };
  }, [taskId, onComplete]);
}
