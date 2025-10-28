import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAuthContext } from "../hooks/useAuth";
import Settings from "../components/Settings/Settings";
import { InviteMembersModal } from "../components/Settings/InviteMembersModal";
import type {
  TeamMember,
  UserProfileSettings,
  Workspace,
  WorkspaceFormSettings,
} from "../types/workspace";
import type { AppDispatch, RootState } from "../store/store";
import { ConfirmationModal } from "../components/UI/ConfirmationModal";
import { appActions } from "../store/appSlice";

const SettingsPage: React.FC = () => {
  const { user } = useAuthContext();
  const { workspaceId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [deleteAction, setDeleteAction] = useState<boolean>(false);
  const [deleteWorkspaceAction, setDeleteWorkspaceAction] =
    useState<boolean>(false);
  const [updateTeamMemberData, setUpdateTeamMemberData] =
    useState<TeamMember | null>(null);

  const [workspace, setWorkspace] = useState<Workspace | undefined>();
  const workspaceSettings = useSelector(
    (state: RootState) => state.app.workspaceSettings
  );
  const deletedWorkspaceId = useSelector(
    (state: RootState) => state.app.deletedWorkspaceId
  );

  const clickTeamMember = useSelector(
    (state: RootState) => state.app.clickTeamMember
  );
  const isInviteMembersModal = useSelector(
    (state: RootState) => state.app.isInviteMembersModal
  );
  const [invitedMember, setInvitedMember] = useState<TeamMember | null>();
  const isConfirmationModal = useSelector(
    (state: RootState) => state.app.isConfirmationModal
  );

  const updateUserProfile = useSelector(
    (state: RootState) => state.app.updateUserProfile
  );

  const teamMemberHandler = (
    formData: TeamMember,
    type: "create" | "update"
  ) => {
    if (!user) {
      toast.error("Failed to invite team member try again");
      return;
    }

    let data: TeamMember;

    if (workspaceId && type === "create") {
      data = { ...formData };
      setInvitedMember(formData);
      return;
    }

    if (workspaceId && type === "update") {
      data = { ...formData };
      setUpdateTeamMemberData(data);
      return;
    }

    if (workspaceId && type === "create") {
      toast.error("Failed to invite team member. Please try again.");
    } else {
      toast.error("Failed to update team member. Please try again.");
    }
  };

  useEffect(() => {
    const getWorkspaceTeamMembers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setWorkspace(data.data);
      } catch (error) {
        console.error("Error fetching workspace:", error);
      }
    };
    const sendInvite = async (member: TeamMember) => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/workspaces/${workspaceId}/members/invite`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(member),
          }
        );

        const data = await res.json();
        setInvitedMember(null);
        if (res.status === 200) {
          toast.success("Invitation sent successfully!");
        }
        if (res.status === 400 || res.status === 404) {
          if (data.errors) {
            toast.error(data?.errors[0].message);
          } else {
            toast.error(data.message);
          }
        }
      } catch (_) {
        toast.error("Failed to send invitation. Please try again.");
      }
    };
    const updateTeamMember = async (member: TeamMember) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}/members/${
            member._id
          }`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(member),
          }
        );

        const data = await res.json();

        // Handle error responses
        if (!res.ok) {
          // Map backend error messages to user-friendly ones
          const errorMessages: Record<string, string> = {
            // Self-change errors
            "Users cannot change their own role or email":
              "You cannot change your own role or email",

            // Manager permission errors
            "Managers cannot change roles of other managers or admins":
              "As a manager, you can only change roles of members and viewers",
            "Managers cannot promote users to manager or admin roles. Only admins can do this.":
              "Only admins can promote users to manager or admin",
            "Managers can only assign member or viewer roles":
              "You can only assign member or viewer roles",
            "Managers cannot change emails of other managers or admins":
              "As a manager, you can only change emails of members and viewers",

            // Owner protection errors
            "Cannot demote the workspace owner":
              "The workspace owner cannot be demoted",
            "Cannot change the workspace owner's email":
              "Cannot change the workspace owner's email",
            "Admin role is reserved for the workspace owner":
              "Only the owner can be an admin",

            // Email-related errors
            "User with this email not found. They must sign up first.":
              "No user found with this email. They need to sign up first.",
            "This user is already a member of this workspace":
              "This user is already a member of this workspace",

            // General errors
            "Workspace member not found":
              "This member no longer exists in the workspace",
            "No changes provided. Please specify role or email to update.":
              "Please provide a role or email to update",
          };

          // Handle validation errors
          if (data.errors && Array.isArray(data.errors)) {
            const errorMessage = data.errors[0]?.message || "Validation error";
            toast.error(errorMessage);
            return;
          }

          // Handle single error messages
          const userFriendlyMessage =
            errorMessages[data.message] || data.message;
          toast.error(userFriendlyMessage);
          return;
        }

        // Handle success responses
        if (res.status === 200) {
          // Check if it's "no changes" or actual update
          if (
            data.message.includes("No changes detected") ||
            data.message.includes("already up to date")
          ) {
            toast(data.message, {
              icon: "⚠",
            });
          } else {
            toast.success(data.message || "Member updated successfully!");
          }

          dispatch(appActions.setClickTeamMember(null));
        }
      } catch (error) {
        console.error("❌ Update member error:", error);
        if (error instanceof TypeError && error.message.includes("fetch")) {
          toast.error(
            "Network error. Please check your connection and try again."
          );
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    };
    const removeTeamMember = async (member: TeamMember) => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}/members/${
            member._id
          }`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        dispatch(appActions.setClickTask(null));
        dispatch(appActions.setClickTeamMember(null));
        toast.success("Member removed successfully!");
      } catch (_) {
        toast.error("Failed to remove member. Please try again.");
      }
    };
    const updateWorkspaceSettings = async (settings: WorkspaceFormSettings) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(settings),
          }
        );

        const data = await res.json();
        if (res.status === 400 || res.status === 403 || res.status === 404) {
          if (data.errors) {
            toast.error(data?.errors[0].message);
          } else {
            toast.error(data.message);
          }
        }
        if (res.status === 200) {
          toast.success("Workspace settings updated successfully!");
        }
        dispatch(appActions.setWorkspaceSettings(null));
      } catch (_) {
        toast.error("Failed to update workspace settings. Please try again.");
      }
    };
    const deleteWorkspace = async (workspaceId: string) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        dispatch(appActions.setDeletedWorkspaceId(null));
        if (res.status === 204) {
          toast.success("Workspace deleted successfully!");
          navigate("/");
        } else {
          toast.error("Failed to delete workspace. Please try again.");
        }
      } catch (_) {
        toast.error("Failed to delete workspace. Please try again.");
      }
    };
    const updateUserProfileFn = async (userProfile: UserProfileSettings) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userProfile),
        });

        const data = await res.json();
        if (res.status === 400 || res.status === 403 || res.status === 404) {
          if (data.errors) {
            toast.error(data?.errors[0].message);
          } else {
            toast.error(data.message);
          }
        }
        if (res.status === 200) {
          if (userProfile.email !== user?.email) {
            toast.success("Please login again to verify your identity");
            setTimeout(() => {
              dispatch(appActions.setIsLogout(true));
            }, 3000);
          } else {
            toast.success("User profile updated successfully!");
          }
        }
        dispatch(appActions.setUpdateUserProfile(null));
      } catch (_) {
        toast.error("Failed to update user profile. Please try again.");
      }
    };

    if (invitedMember) {
      sendInvite(invitedMember);
      setInvitedMember(null);
    }

    if (updateTeamMemberData) {
      updateTeamMember(updateTeamMemberData);
      setUpdateTeamMemberData(null);
    }

    if (clickTeamMember && deleteAction) {
      removeTeamMember(clickTeamMember);
      setDeleteAction(false);
    }

    if (workspaceSettings) {
      if (!user) {
        toast.error("Failed to save workspace settings. please try again.");
      } else {
        updateWorkspaceSettings(workspaceSettings);
      }
    }

    if (updateUserProfile) {
      updateUserProfileFn(updateUserProfile);
    }

    if (deletedWorkspaceId && deleteWorkspaceAction) {
      deleteWorkspace(deletedWorkspaceId);
      setDeleteWorkspaceAction(false);
    }

    if (user) {
      getWorkspaceTeamMembers();
    }
  }, [
    clickTeamMember,
    deleteAction,
    deleteWorkspaceAction,
    deletedWorkspaceId,
    dispatch,
    invitedMember,
    navigate,
    updateTeamMemberData,
    updateUserProfile,
    user,
    workspaceId,
    workspaceSettings,
  ]);

  return (
    <>
      <Settings workspace={workspace} />
      {isInviteMembersModal && (
        <InviteMembersModal
          isOpen={isInviteMembersModal}
          onSubmit={teamMemberHandler}
          initialData={clickTeamMember}
        />
      )}
      {isConfirmationModal && !deletedWorkspaceId && (
        <ConfirmationModal
          isOpen={isConfirmationModal}
          action={() => setDeleteAction(true)}
          title={"Confirmation"}
          message={"Are you sure you want to remove this team member?"}
          type="team"
        />
      )}
      {isConfirmationModal && deletedWorkspaceId && (
        <ConfirmationModal
          isOpen={isConfirmationModal}
          action={() => setDeleteWorkspaceAction(true)}
          title={"Confirmation"}
          message={"Are you sure you want to delete this workspace?"}
          type="workspace"
        />
      )}
    </>
  );
};

export default SettingsPage;
