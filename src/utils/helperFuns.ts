import { type Assignee } from "../types/workspace";

export const isAssigneeArray = (
  assignees: Assignee[] | string[]
): assignees is Assignee[] => {
  return assignees.length > 0 && typeof assignees[0] === "object";
};

const colorArray = [
  "text-fuchsia-500",
  "text-indigo-500",
  "text-green-500",
  "text-amber-500",
];

export const getColorForIndex = (index: number) => {
  return colorArray[index % colorArray.length];
};

export const getPriorityColor = (priority: string) => {
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
