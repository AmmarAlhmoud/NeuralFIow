import { type Assignee } from "../../types/workspace";

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
