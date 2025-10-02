import React from "react";
import { Plus, Menu } from "lucide-react";
import { type TeamMember, type Workspace } from "../../types/workspace";
import { Button } from "../ui/Button"; // adjust import path if needed
import Loading from "../ui/Loading";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { appActions } from "../../store/appSlice";

interface SettingsProps {
  workspace: Workspace | undefined;
}

const Settings: React.FC<SettingsProps> = ({ workspace }) => {
  const dispatch = useDispatch<AppDispatch>();

  const getAvatarColor = (color: string) => {
    const colors = {
      violet: "from-violet-500 to-purple-600",
      cyan: "from-cyan-500 to-blue-600",
      green: "from-green-500 to-emerald-600",
      orange: "from-orange-500 to-red-600",
    };
    return colors[color as keyof typeof colors] || colors.violet;
  };

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

  // const teamMembers: TeamMember[] = [
  //   {
  //     id: "1",
  //     name: "Alex Chen",
  //     email: "alex@neuralflow.ai",
  //     role: "Product Lead",
  //     avatar: "violet",
  //     isOnline: true,
  //   },
  //   {
  //     id: "2",
  //     name: "Sarah Rodriguez",
  //     email: "sarah@neuralflow.ai",
  //     role: "AI Engineer",
  //     avatar: "cyan",
  //     isOnline: true,
  //   },
  //   {
  //     id: "3",
  //     name: "Marcus Kim",
  //     email: "marcus@neuralflow.ai",
  //     role: "UX Designer",
  //     avatar: "green",
  //     isOnline: false,
  //   },
  // ];

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
    console.log(teamMembers);

    teamMembersList = teamMembers.map((member) => (
      <div
        key={member._id}
        className="flex items-center justify-between p-4 dark:bg-white/5 bg-black/5 rounded-xl dark:hover:bg-white/10 hover:bg-black/10 transition-all"
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={member.uid!.avatarURL || ""}
              alt={`${member.uid!.name?.split(" ")[0]} avatar`}
              className="w-12 h-12 bg-gradient-to-r rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 ${
                member.isOnline ? "bg-green-500" : "bg-yellow-500"
              } rounded-full border-2 border-gray-900 ${
                member.isOnline ? "animate-pulse" : ""
              }`}
            ></div>
          </div>
          <div>
            <div className="font-semibold dark:text-white text-black">
              {member.uid!.name}
            </div>
            <div className="text-sm text-gray-400">
              {member.position} • {member.uid!.email}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              member.role === "admin"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 dark:text-white text-black"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 dark:text-white text-black"
            }`}
          >
            {member.role.replace(
              member.role[0],
              member.role[0].toUpperCase()
            ) || "Member"}
          </span>
          <button className="dark:text-gray-400 text-gray-800 dark:hover:text-white hover:text-black">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    ));
  }

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

          {/* Team Members (NO submit button) */}
          <div className="glassmorphic rounded-2xl p-8">
            <h3 className="text-xl font-semibold dark:text-white text-black mb-6">
              Neural Team
            </h3>
            <div className="space-y-4">{teamMembersList}</div>

            <Button
              variant="gradient"
              size="md-full"
              className="mt-6 flex justify-center"
              onClick={() => dispatch(appActions.setInviteMembersModal(true))}
            >
              <Plus className="w-5 h-5 mr-2" />
              Invite Team Member
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Neural Settings */}
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
                <div key={index} className="flex items-center justify-between">
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

          {/* Workspace Settings */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Workspace settings saved");
            }}
            className="glassmorphic rounded-2xl p-8"
          >
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
                  defaultValue="Neural Marketing AI"
                  className="w-full px-4 py-3 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl dark:text-white text-black placeholder-gray-400 focus:outline-none input-glow"
                />
              </div>
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Time Zone
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
                    <option>UTC-8 (Pacific)</option>
                    <option>UTC-5 (Eastern)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (CET)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    AI Model
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
                    <option>Gemini</option>
                  </select>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md-full"
              className="mt-6"
            >
              Save Workspace
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
