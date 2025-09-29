import { type Assignee } from "../../types/workspace";

export const isAssigneeArray = (
  assignees: Assignee[] | string[]
): assignees is Assignee[] => {
  return assignees.length > 0 && typeof assignees[0] === "object";
};
