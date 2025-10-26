import React, { useState } from "react";
import { createPortal } from "react-dom";
import { BookOpenText, Paintbrush, TextQuote, X } from "lucide-react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import type { Workspace } from "../../types/workspace";
import { Textarea } from "../UI/Textarea";
import toast from "react-hot-toast";

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Workspace) => void;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Workspace>({
    name: "",
    color: "#7f22fe",
  });

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

    if (formData.name.trim().length === 0) {
      toast.error("Workspace name is required");
      return;
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="flex flex-col glassmorphic rounded-2xl p-6 max-w-sm w-full  neon-glow animate-fade-in">
        <X
          className="text-dark dark:text-white w-5 h-5 self-end hover:scale-110 transition-transform duration-100 ease-in-out"
          onClick={onClose}
        />

        <h3 className="text-2xl text-center font-semibold text-dark dark:text-white mb-4">
          Create Workspace
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <label
            className="text-sm ml-1 text-left font-medium text-gray-700 dark:text-gray-300"
            title="Workspace Name (Mandatory)"
          >
            Workspace name <span className="text-red-500">*</span>
          </label>
          <Input
            type="name"
            name="name"
            className="mt-1"
            placeholder="Enter workspace name"
            value={formData.name}
            onChange={handleInputChange}
            required
            icon={
              <BookOpenText className="text-dark dark:text-white w-5 h-5" />
            }
          />

          <label
            className="text-sm ml-1 text-left font-medium text-gray-700 dark:text-gray-300"
            title="Workspace Description (Optional)"
          >
            Workspace Description
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

          <div className="w-full flex items-center justify-center space-x-2 ">
            <Input
              className="py-6 w-20"
              type="color"
              name="color"
              placeholder="choose workspace color (optional)"
              value={formData.color}
              onChange={handleInputChange}
              icon={
                <Paintbrush className="text-dark dark:text-white w-5 h-5" />
              }
            />
            <div
              className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: formData.color }}
            />
          </div>

          <Button type="submit" size="lg-full" className="px-6 py-2">
            Create Workspace
          </Button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root")!);
};
