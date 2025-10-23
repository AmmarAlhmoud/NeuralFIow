import React from "react";
import { Star } from "lucide-react";

interface NuralAssistantProps {
  type: "summary" | "subtasks" | "priority";
  content: string | string[];
  reason?: string;
  lastProcessed?: Date;
}

const NuralAssistant: React.FC<NuralAssistantProps> = ({
  type,
  content,
  reason,
  lastProcessed,
}) => {
  return (
    <div className="flex space-x-3">
      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex-shrink-0 flex items-center justify-center">
        <Star className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl p-4 border border-cyan-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-cyan-300 text-sm">
              Neural AI Assistant
            </span>
            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-xs font-medium">
              AI
            </span>
            <span className="text-xs dark:text-gray-400 text-gray-800">
              {new Date(lastProcessed || Date.now()).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>
          </div>
          <div className="text-sm dark:text-gray-300 text-gray-700">
            {type === "summary" && typeof content === "string" && (
              <div className="space-y-1">
                {content.split("•").map((line: string, id: number) => {
                  const trimmed = line.trim();
                  return trimmed ? <p key={id}>• {trimmed}</p> : null;
                })}
              </div>
            )}
            {type === "priority" && (
              <div className="space-y-1">
                {content}
                {reason && (
                  <p className="mt-2 text-xs italic text-gray-400">
                    <strong>Reason:</strong> {reason}
                  </p>
                )}
              </div>
            )}
            {type === "subtasks" && Array.isArray(content) && (
              <div className="space-y-1">
                {content.map((subtask: string, id: number) => (
                  <p key={id}>• {subtask}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuralAssistant;
