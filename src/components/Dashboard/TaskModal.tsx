import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import toast from "react-hot-toast";
import type {
  Assignee,
  Task,
  TeamMember,
  Workspace,
} from "../../types/workspace";
import { useDispatch } from "react-redux";
import { appActions } from "../../store/appSlice";
import { CustomSelectInput } from "../ui/CustomSelectInput";
import { isAssigneeArray } from "../../utils/helperFuns";
import DateTimePicker from "../ui/DateTimePicker";

interface TaskModalProps {
  isOpen: boolean | null;
  onSubmit: (formData: Task, type: "create" | "update") => void;
  initialData?: Task | null;
  workspace: Workspace | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onSubmit,
  initialData,
  workspace,
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
    dueDate: initialData?.dueDate || null,
    estimate: initialData?.estimate,
    progress: initialData?.progress,
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

    if (data.estimate) {
      const estimateNumber = Number(data.estimate);
      if (isNaN(estimateNumber) || estimateNumber <= 0) {
        toast.error("Please enter a valid number for estimated hours");
        return;
      }
      data = { ...data, estimate: estimateNumber };
    }
    if (data.progress) {
      const progressNumber = Number(data.progress);
      if (isNaN(progressNumber) || progressNumber <= 0) {
        toast.error("Please enter a valid number for progress");
        return;
      }
      if (progressNumber < 1 || progressNumber > 100) {
        toast.error("Please enter a number between 1 and 100 for progress");
        return;
      }
      data = { ...data, progress: progressNumber };
    }

    if (isAssigneeArray(data.assignees)) {
      const assigneesIds = data.assignees.map((assignee) => assignee._id!);
      data = { ...data, assignees: assigneesIds };
    }

    if (initialData) {
      onSubmit(data, "update");
      dispatch(appActions.setTaskModal(false));
      return;
    }

    onSubmit(data, "create");
    dispatch(appActions.setTaskModal(false));
  };

  if (!isOpen) return null;

  // Options
  const tagOptions = [
    { value: "Research", label: "Research" },
    { value: "Data Analysis", label: "Data Analysis" },
    { value: "Frontend", label: "Frontend" },
    { value: "Backend", label: "Backend" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Testing", label: "Testing" },
    { value: "Development", label: "Development" },
    { value: "Project Management", label: "Project Management" },
    { value: "UI/UX", label: "UI/UX" },

    { value: "SEO", label: "SEO" },
    { value: "Analytics", label: "Analytics" },
    { value: "Quality Assurance", label: "Quality Assurance" },
    { value: "DevOps", label: "DevOps" },
    { value: "Security", label: "Security" },
    { value: "Mobile", label: "Mobile" },
    { value: "Database", label: "Database" },
    { value: "Cloud", label: "Cloud" },
    { value: "Networking", label: "Networking" },
    { value: "Machine Learning", label: "Machine Learning" },

    { value: "AI", label: "AI" },
    { value: "Big Data", label: "Big Data" },
    { value: "Blockchain", label: "Blockchain" },
    { value: "Game Development", label: "Game Development" },
    { value: "Multimedia", label: "Multimedia" },
    { value: "E-commerce", label: "E-commerce" },
    { value: "Social Media", label: "Social Media" },
    { value: "Content Creation", label: "Content Creation" },
    { value: "Writing", label: "Writing" },
    { value: "Editing", label: "Editing" },

    { value: "Customer Support", label: "Customer Support" },
    { value: "Documentation", label: "Documentation" },
    { value: "Automation", label: "Automation" },
    { value: "Integration", label: "Integration" },
    { value: "Performance", label: "Performance" },
    { value: "Accessibility", label: "Accessibility" },
    { value: "Localization", label: "Localization" },
    { value: "Legal", label: "Legal" },
    { value: "Compliance", label: "Compliance" },
    { value: "Training", label: "Training" },

    { value: "Recruitment", label: "Recruitment" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "Budgeting", label: "Budgeting" },
    { value: "Strategy", label: "Strategy" },
    { value: "Innovation", label: "Innovation" },
    { value: "Research and Development", label: "Research and Development" },
    { value: "Leadership", label: "Leadership" },
    { value: "Operations", label: "Operations" },
    { value: "Support", label: "Support" },

    { value: "Maintenance", label: "Maintenance" },
    { value: "Bug Fixing", label: "Bug Fixing" },
    { value: "Refactoring", label: "Refactoring" },
    { value: "Documentation Writing", label: "Documentation Writing" },
    { value: "User Testing", label: "User Testing" },
    { value: "Prototyping", label: "Prototyping" },
    { value: "Deployment", label: "Deployment" },
    { value: "Monitoring", label: "Monitoring" },
    { value: "Customer Feedback", label: "Customer Feedback" },
    { value: "Collaboration", label: "Collaboration" },

    { value: "Planning", label: "Planning" },
    { value: "Sprint", label: "Sprint" },
    { value: "Scrum", label: "Scrum" },
    { value: "Kanban", label: "Kanban" },
    { value: "Agile", label: "Agile" },
    { value: "Waterfall", label: "Waterfall" },
    { value: "Bug Tracking", label: "Bug Tracking" },
    { value: "Code Review", label: "Code Review" },
    { value: "Continuous Integration", label: "Continuous Integration" },
    { value: "Continuous Delivery", label: "Continuous Delivery" },

    { value: "Testing Automation", label: "Testing Automation" },
    { value: "Unit Testing", label: "Unit Testing" },
    { value: "Integration Testing", label: "Integration Testing" },
    { value: "End to End Testing", label: "End to End Testing" },
    { value: "Database Design", label: "Database Design" },
    { value: "Server Management", label: "Server Management" },
    { value: "API Design", label: "API Design" },
    { value: "Web Development", label: "Web Development" },
    { value: "Mobile Development", label: "Mobile Development" },
    { value: "Cross Platform", label: "Cross Platform" },

    { value: "React", label: "React" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C++", label: "C++" },
    { value: "SQL", label: "SQL" },
    { value: "NoSQL", label: "NoSQL" },
    { value: "GraphQL", label: "GraphQL" },

    { value: "Docker", label: "Docker" },
    { value: "Kubernetes", label: "Kubernetes" },
    { value: "AWS", label: "AWS" },
    { value: "Azure", label: "Azure" },
    { value: "GCP", label: "GCP" },
    { value: "Linux", label: "Linux" },
    { value: "Windows", label: "Windows" },
    { value: "MacOS", label: "MacOS" },
    { value: "Virtualization", label: "Virtualization" },
    { value: "Automation Testing", label: "Automation Testing" },

    { value: "Performance Testing", label: "Performance Testing" },
    { value: "UI Testing", label: "UI Testing" },
    { value: "UX Design", label: "UX Design" },
    { value: "Product Management", label: "Product Management" },
    { value: "Customer Success", label: "Customer Success" },
    { value: "Technical Writing", label: "Technical Writing" },
    { value: "DevSecOps", label: "DevSecOps" },
    { value: "SRE", label: "SRE" },
    { value: "Site Reliability", label: "Site Reliability" },
    { value: "Incident Management", label: "Incident Management" },
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

  const teamMembers: TeamMember[] | undefined = workspace?.members;

  let assigneeOptions: Assignee[] = [];

  if (teamMembers) {
    assigneeOptions = teamMembers.map((member) => {
      return {
        _id: member.uid?._id || "",
        name: member.uid?.name || "",
        email: member.uid?.email || "",
        avatarURL: member.uid?.avatarURL || "",
      };
    });
  }

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

          <div className="flex gap-2">
            <div className="flex-1 flex flex-col space-y-1">
              <label
                className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
                title="Due Date (Optional)"
              >
                Due Date
              </label>
              <DateTimePicker
                value={formData.dueDate ? new Date(formData.dueDate) : null}
                onChange={(newDate) =>
                  setFormData((prev) => ({
                    ...prev,
                    dueDate: newDate || null,
                  }))
                }
              />
            </div>
            <div className="flex-0.5">
              <label
                className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
                title="Estimate (Optional)"
              >
                Estimate (h)
              </label>
              <Input
                type="text"
                name="estimate"
                className="!w-22 !h-12"
                placeholder="e.g., 3h"
                value={formData.estimate}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-0.5">
              <label
                className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
                title="Progress (Optional)"
              >
                Progress (%)
              </label>
              <Input
                type="text"
                name="progress"
                className="!w-24 !h-12"
                placeholder="e.g., 50%"
                value={formData.progress}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button type="submit" size="lg-full">
            {initialData ? "Update Task" : "Create Task"}
          </Button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};
