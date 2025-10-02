import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import toast from "react-hot-toast";
import type { TeamMember } from "../../types/workspace";
import { useDispatch } from "react-redux";
import { appActions } from "../../store/appSlice";
import { CustomSelectInput } from "../ui/CustomSelectInput";

interface InviteMembersModalProps {
  isOpen: boolean | null;
  onSubmit: (formData: TeamMember) => void;
}

export const InviteMembersModal: React.FC<InviteMembersModalProps> = ({
  isOpen,
  onSubmit,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<TeamMember>({
    email: "",
    role: "member",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: TeamMember = { ...formData };

    if (!data.email.trim()) {
      toast.error("Team member email is required");
      return;
    }

    console.log(data);

    onSubmit(data);
    dispatch(appActions.setInviteMembersModal(false));
  };

  if (!isOpen) return null;

  // Roles
  const roleOptions = [
    { value: "viewer", label: "Viewer" },
    { value: "member", label: "Member" },
    { value: "manager", label: "Manager" },
    { value: "admin", label: "Admin" },
  ];

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="flex flex-col glassmorphic rounded-2xl py-5 px-8 max-w-lg w-full neon-glow animate-fade-in relative">
        <X
          className="text-dark dark:text-white w-5 h-5 absolute top-4 right-4 cursor-pointer hover:scale-110 transition-transform duration-100 ease-in-out"
          onClick={() => {
            dispatch(appActions.setInviteMembersModal(false));
          }}
        />
        <h3 className="text-2xl text-center font-semibold dark:text-white text-dark mb-4">
          Invite Team Member
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
            title="Team Member Email (Mandatory)"
          >
            Team Member Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="email"
            className="mt-1"
            placeholder="Enter member email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <label
                className="text-sm ml-1 font-medium text-gray-700 dark:text-gray-300"
                title="Role (Mandatory)"
              >
                Role <span className="text-red-500">*</span>
              </label>
              <CustomSelectInput
                value={formData.role || "member"}
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: v as "admin" | "manager" | "member" | "viewer",
                  }))
                }
                options={roleOptions}
                isMulti={false}
              />
            </div>
          </div>

          <Button type="submit" size="lg-full">
            Invite Team Member
          </Button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};
