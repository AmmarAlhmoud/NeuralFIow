import React, { useState } from "react";
import { Button } from "../ui/Button";
import useTimezone from "../../hooks/useTimezone";
import type { WorkspaceFormSettings, Workspace } from "../../types/workspace";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { appActions } from "../../store/appSlice";
import TimezoneSelect from "../ui/TimezoneSelect";

interface WorkspaceSettingsProps {
  initialData: Workspace | undefined;
}

const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({
  initialData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { timezone, setTimezone } = useTimezone();

  const [formData, setFormData] = useState<WorkspaceFormSettings>({
    name: initialData?.name || "",
    aiModel: initialData?.settings?.aiModel || "Gemini",
    allowInvites: initialData?.settings?.allowInvites ?? true,
    timezone: initialData?.settings?.timezone || timezone,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "timezone" && typeof value === "string") {
      setTimezone(value);
    }
  };

  const toggleAllowInvites = () =>
    setFormData((prev) => ({ ...prev, allowInvites: !prev.allowInvites }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData?.name?.trim()) {
      toast.error("Workspace name can't be empty");
      return;
    }

    dispatch(appActions.setWorkspaceSettings(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="glassmorphic rounded-2xl p-8">
      <h3 className="text-xl font-semibold dark:text-white text-black mb-6">
        Workspace
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-3">
            Workspace Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl dark:text-white text-black placeholder-gray-400 focus:outline-none input-glow"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Time Zone
          </label>
          <TimezoneSelect
            timezone={formData.timezone || timezone}
            handleChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            AI Model
          </label>
          <div className="relative w-full">
            <select
              name="aiModel"
              value={formData.aiModel}
              onChange={handleChange}
              className="w-full appearance-none pr-10 px-4 py-3 bg-white/5 dark:bg-gray-800/80 border border-black/10 dark:border-gray-700/70 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b74fd6]/50 dark:focus:ring-[#d64f4f]/50 backdrop-blur-sm input-glow transition-all"
            >
              <option value="Gemini">Gemini</option>
            </select>

            {/* Dropdown arrow icon */}
            <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
              <svg
                className="w-3 h-3 text-dark dark:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Allow Invites
          </label>

          <div className="flex items-center justify-between">
            <div className="mr-4">
              <div className="text-sm dark:text-gray-400 text-gray-800">
                Let members invite new people to this workspace
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.allowInvites}
              onClick={toggleAllowInvites}
              className={`relative inline-flex h-6 w-14 items-center rounded-full transition-colors outline-none focus-visible:ring focus-visible:ring-purple-400 ${
                formData.allowInvites
                  ? "bg-gradient-to-r from-neon-scarlet to-neon-fuchsia"
                  : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-lg ${
                  formData.allowInvites ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <Button type="submit" variant="primary" size="md-full" className="mt-6">
        Save Workspace
      </Button>
      <Button
        type="button"
        variant="warning"
        size="md-full"
        className="mt-6"
        onClick={() => {
          if (initialData?._id) {
            dispatch(appActions.setDeletedWorkspaceId(initialData._id));
            dispatch(appActions.setConfirmationModal(true));
          }
        }}
      >
        Delete Workspace
      </Button>
    </form>
  );
};

export default WorkspaceSettings;
