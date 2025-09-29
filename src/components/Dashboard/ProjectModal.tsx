import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { BookOpenText, Key, TextQuote, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { Project } from "../../types/workspace";
import { Textarea } from "../ui/Textarea";
import { appActions } from "../../store/appSlice";
import { useParams } from "react-router-dom";

interface ProjectModalProps {
  isOpen: boolean;
  onSubmit: (formData: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const { workspaceId } = useParams();

  const [formData, setFormData] = useState<Project>({
    workspaceId: "",
    name: "",
    key: null,
    description: "",
    status: "active",
  });

  const generateKey = (name: string): string => {
    const baseKey = name
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 4)
      .toUpperCase();
    return baseKey || "PRJ";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      const sanitizedValue = value.replace(/[^a-zA-Z0-9 ]/g, "");

      // Check if invalid characters were typed
      if (value !== sanitizedValue) {
        toast.dismiss();
        toast.error("Only letters, numbers, and spaces are allowed!");
      }

      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!workspaceId) {
      toast.error("Something went wrong, please try again later.");
      return;
    }

    // Auto-generate key if left empty
    const finalKey = formData.key?.trim()
      ? formData.key.toUpperCase()
      : generateKey(formData.name);

    const data: Project = {
      ...formData,
      workspaceId,
      key: finalKey,
    };

    onSubmit(data);
    dispatch(appActions.setProjectModal(false));
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="flex flex-col glassmorphic rounded-2xl p-6 max-w-sm w-full  neon-glow animate-fade-in">
        <X
          className="text-dark dark:text-white w-5 h-5 self-end hover:scale-110 transition-transform duration-100 ease-in-out"
          onClick={() => dispatch(appActions.setProjectModal(false))}
        />

        <h3 className="text-2xl text-center font-semibold text-dark dark:text-white mb-4">
          Create Project
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <label className="text-sm ml-1 text-left font-medium text-gray-700 dark:text-gray-300">
            Project Name
          </label>
          <Input
            type="text"
            name="name"
            className="mt-1"
            placeholder="Enter project name"
            value={formData.name}
            onChange={handleInputChange}
            required
            icon={
              <BookOpenText className="text-dark dark:text-white w-5 h-5" />
            }
          />

          <label className="text-sm ml-1 text-left font-medium text-gray-700 dark:text-gray-300">
            Project Key (Optional)
          </label>
          <Input
            type="text"
            name="key"
            className="mt-1"
            placeholder="Auto-generated if empty"
            value={formData.key || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                key: e.target.value.toUpperCase(),
              }))
            }
            icon={
              <Key className="text-dark dark:text-white w-5 h-5 self-start my-4" />
            }
          />

          {!formData.key && formData.name && (
            <p className="text-xs text-gray-500 mt-1 text-center">
              Auto-generated key:{" "}
              <span className="font-mono">{generateKey(formData.name)}</span>
            </p>
          )}

          <label className="text-sm ml-1 text-left font-medium text-gray-700 dark:text-gray-300">
            Project Description (Optional)
          </label>
          <Textarea
            className="min-h-[100px] mt-1"
            name="description"
            placeholder="Enter description"
            rows={4}
            cols={50}
            value={formData.description}
            onChange={handleInputChange}
            icon={
              <TextQuote className="text-dark dark:text-white w-5 h-5 self-start my-4" />
            }
          />

          <Button type="submit" size="lg-full" className="px-6 py-2">
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root")!);
};
