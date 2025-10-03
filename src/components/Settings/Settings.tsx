import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { type TeamMember, type Workspace } from "../../types/workspace";
import { Button } from "../ui/Button";
import Loading from "../ui/Loading";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { appActions } from "../../store/appSlice";
import TeamMemberCard from "./TeamMemberCard";
import { useAuthContext } from "../../hooks/useAuth";
import WorkspaceSettings from "./WorkspaceSettings";
import type { Role } from "../../types/auth";

interface SettingsProps {
  workspace: Workspace | undefined;
}

const Settings: React.FC<SettingsProps> = ({ workspace }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuthContext();
  const [currentUser, setCurrentUser] = useState(false);

  const [currentUserRole, setCurrentUserRole] = useState<Role>("viewer");

  const aiSettings = [
    {
      label: "Auto-prioritize tasks",
      description: "Let AI automatically set task priorities",
      enabled: true,
    },
    {
      label: "Generate subtasks",
      description: "AI breaks down complex tasks automatically",
      enabled: true,
    },
    {
      label: "Smart notifications",
      description: "Intelligent notification timing",
      enabled: false,
    },
    {
      label: "Workflow optimization",
      description: "AI suggests process improvements",
      enabled: true,
    },
  ];

  let teamMembersList: React.ReactNode;
  const teamMembers: TeamMember[] | undefined = workspace?.members;

  if (teamMembers === undefined) {
    teamMembersList = (
      <div className="my-16">
        <Loading />
      </div>
    );
  }

  if (teamMembers && teamMembers?.length !== 0) {
    teamMembersList = teamMembers.map((member) => (
      <TeamMemberCard
        key={member._id}
        member={member}
        currentUserRole={currentUserRole}
      />
    ));
  }

  useEffect(() => {
    if (!user) return;

    const isOwnerOrManager = !!teamMembers?.find(
      (m) => m?.uid?.uid === user?.uid && ["admin"].includes(m.role)
    );
    setCurrentUser(isOwnerOrManager);

    const me = teamMembers?.find((m) => m?.uid?.uid === user?.uid);
    setCurrentUserRole((me?.role as Role) ?? "viewer");
  }, [teamMembers, user, user?.uid]);

  return (
    <div className="px-6 pb-6">
      {/* Header */}
      <div className="mb-8 glassmorphic rounded-2xl p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r dark:from-white dark:to-gray-300 from-black to-gray-700 bg-clip-text text-transparent mb-2">
          Neural Settings
        </h1>
        <p className="dark:text-gray-400 text-gray-800">
          Configure your AI workspace and team preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Settings */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Profile saved");
            }}
            className="glassmorphic rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold dark:text-white text-black mb-6">
              Profile Configuration
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Alex Chen"
                  className="w-full px-4 py-3 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10  rounded-xl dark:text-white text-black dark:placeholder-gray-400 placeholder-gray-800 focus:outline-none input-glow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="alex@neuralflow.ai"
                  className="w-full px-4 py-3 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl dark:text-white text-black dark:placeholder-gray-400  placeholder-gray-800 focus:outline-none input-glow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Position
                </label>
                <select
                  className="
                    w-full px-4 py-3
                    bg-white/5 dark:bg-gray-800/80
                    border border-black/10 dark:border-gray-700/70
                    rounded-xl
                    text-black dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-[#b74fd6]/50 dark:focus:ring-[#d64f4f]/50
                    backdrop-blur-sm
                    input-glow
                    transition-all
                  "
                >
                  <option>Product Lead</option>
                  <option>AI Engineer</option>
                  <option>UX Designer</option>
                  <option>Data Scientist</option>
                </select>
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md-full"
              className="mt-6"
            >
              Save Profile
            </Button>
          </form>

          {/* Team Members */}
          <div className="glassmorphic rounded-2xl p-8">
            <h3 className="text-xl font-semibold dark:text-white text-black mb-6">
              Neural Team
            </h3>
            <div className="space-y-4 min-h-67 max-h-67 overflow-y-scroll custom-scrollbar px-2">
              {teamMembersList}
            </div>

            {(currentUser ||
              (currentUserRole === "manager" &&
                workspace?.settings?.allowInvites)) && (
              <Button
                variant="gradient"
                size="md-full"
                className="mt-6 flex justify-center"
                onClick={() => dispatch(appActions.setInviteMembersModal(true))}
              >
                <Plus className="w-5 h-5 mr-2" />
                Invite Team Member
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Neural Settings */}
          {currentUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("AI settings saved");
              }}
              className="glassmorphic rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold dark:text-white text-black mb-6">
                AI Neural Network
              </h3>
              <div className="space-y-6">
                {aiSettings.map((setting, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium dark:text-white text-black">
                        {setting.label}
                      </div>
                      <div className="text-sm dark:text-gray-400 text-gray-800">
                        {setting.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.enabled
                          ? "bg-gradient-to-r from-neon-scarlet to-neon-fuchsia"
                          : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition shadow-lg ${
                          setting.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      ></span>
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md-full"
                className="mt-6"
              >
                Save AI Settings
              </Button>
            </form>
          )}

          {/* Workspace Settings */}
          {currentUser && <WorkspaceSettings initialData={workspace} />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
