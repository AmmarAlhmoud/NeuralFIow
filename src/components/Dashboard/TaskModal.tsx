import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import toast from "react-hot-toast";
import type { Assignee, Task } from "../../types/workspace";
import { useDispatch } from "react-redux";
import { appActions } from "../../store/appSlice";
import { CustomSelectInput } from "../ui/CustomSelectInput";
import { isAssigneeArray } from "../Utils/helperFuns";

interface TaskModalProps {
  isOpen: boolean | null;
  onSubmit: (formData: Task, type: "create" | "update") => void;
  initialData?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onSubmit,
  initialData,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<Task>({
    _id: initialData?._id || "",
    projectId: initialData?.projectId || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    assignees: initialData?.assignees || [],
    priority: initialData?.priority || "medium",
    status: initialData?.status || "todo",
    dueDate: initialData?.dueDate,
    estimate: initialData?.estimate,
    tags: initialData?.tags || [],
    order: initialData?.order || 6,
    createdBy: initialData?.createdBy || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let data: Task = { ...formData };

    if (!data.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (isAssigneeArray(data.assignees)) {
      const assigneesIds = data.assignees.map((assignee) => assignee._id!);
      data = { ...data, assignees: assigneesIds };
    }

    console.log(data);

    if (initialData) {
      onSubmit(data, "update");
      dispatch(appActions.setTaskModal(false));
      return;
    }

    onSubmit(data, "create");
    dispatch(appActions.setTaskModal(false));
  };

  if (!isOpen) return null;

  // TODO: Increase the number of tags
  // Options
  const tagOptions = [
    { value: "Research", label: "Research" },
    { value: "Data Analysis", label: "Data Analysis" },
    { value: "Frontend", label: "Frontend" },
    { value: "Backend", label: "Backend" },
    { value: "Design", label: "Design" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  const orderOptions = [
    { value: "6", label: "Default" },
    { value: "1", label: "First" },
    { value: "2", label: "Second" },
    { value: "3", label: "Third" },
    { value: "4", label: "Fourth" },
    { value: "5", label: "Fifth" },
  ];

  const assigneeOptions: Assignee[] = [
    {
      _id: "assignee1",
      name: "John Doe",
      email: "john@example.com",
      avatarUrl: "https://www.gravatar.com/avatar/?d=mp",
    },
    {
      _id: "assignee2",
      name: "Jane Smith",
      email: "jane@example.com",
      avatarUrl: "https://www.gravatar.com/avatar/?d=mp",
    },
  ];

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="flex flex-col glassmorphic rounded-2xl py-5 px-8 max-w-lg w-full neon-glow animate-fade-in relative">
        <X
          className="text-dark dark:text-white w-5 h-5 absolute top-4 right-4 cursor-pointer hover:scale-110 transition-transform duration-100 ease-in-out"
          onClick={() => {
            dispatch(appActions.setTaskModal(false));
            dispatch(appActions.setClickTask(null));
          }}
        />
        <h3 className="text-2xl text-center font-semibold dark:text-white text-dark mb-4">
          {initialData ? "Edit Task" : "Create Task"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
            title="Task Title (Mandatory)"
          >
            Task Title <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="title"
            className="mt-1"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <label
            className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
            title="Task Description (Optional)"
          >
            Task Description
          </label>
          <Textarea
            name="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleInputChange}
            className="min-h-[30px] mt-1"
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <label
                className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
                title="Priority (Mandatory)"
              >
                Priority <span className="text-red-500">*</span>
              </label>
              <CustomSelectInput
                value={formData.priority || "medium"}
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: v as "low" | "medium" | "high" | "critical",
                  }))
                }
                options={priorityOptions}
                isMulti={false}
              />
            </div>

            <div className="flex-1">
              <label
                className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
                title="Status (Mandatory)"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <CustomSelectInput
                value={formData.status}
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: v as "todo" | "in_progress" | "done",
                  }))
                }
                options={statusOptions}
                isMulti={false}
              />
            </div>
            <div className="flex-1">
              <label
                className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
                title="Status (Mandatory)"
              >
                Order
              </label>
              <CustomSelectInput
                value={formData.order.toString() || "6"}
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: +v as number,
                  }))
                }
                options={orderOptions}
                isMulti={false}
              />
            </div>
          </div>

          <label
            className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
            title="Tags (Optional)"
          >
            Tags
          </label>
          <div>
            <CustomSelectInput
              value={formData.tags}
              onChange={(tags) =>
                setFormData((prev) => ({ ...prev, tags: tags as string[] }))
              }
              options={tagOptions}
              isMulti={true}
              placeholder="Select tags..."
            />
          </div>

          <label
            className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
            title="Assignees (Optional)"
          >
            Assignees
          </label>
          <div>
            <CustomSelectInput
              value={formData.assignees}
              onChange={(assignees) =>
                setFormData((prev) => ({
                  ...prev,
                  assignees: assignees as Assignee[],
                }))
              }
              options={assigneeOptions}
              isMulti={true}
              isAssigneeSelect={true}
              placeholder="Select assignees..."
            />
          </div>

          <label
            className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
            title="Due Date (Optional)"
          >
            Due Date
          </label>
          <Input
            type="date"
            name="dueDate"
            className="mt-1"
            value={
              formData.dueDate
                ? new Date(formData.dueDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
          />

          <Button type="submit" size="lg-full">
            {initialData ? "Update Task" : "Create Task"}
          </Button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};
