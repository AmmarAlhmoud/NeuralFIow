import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAuthContext } from "../hooks/useAuth";
import Settings from "../components/Settings/Settings";
import { InviteMembersModal } from "../components/Settings/InviteMembersModal";
import type {
  TeamMember,
  Workspace,
  WorkspaceFormSettings,
} from "../types/workspace";
import type { AppDispatch, RootState } from "../store/store";
import { ConfirmationModal } from "../components/ui/ConfirmationModal";
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

  const userProfile = useSelector((state: RootState) => state.app.userProfile);

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
          `${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}/members`,
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
        if (res.status === 400 || res.status === 403 || res.status === 404) {
          if (data.errors) {
            toast.error(data?.errors[0].message);
          } else {
            toast.error(data.message);
          }
        }
        if (res.status === 200) {
          toast.success("Member updated successfully!");
        }
        dispatch(appActions.setClickTeamMember(null));
      } catch (_) {
        toast.error("Failed to update member. Please try again.");
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

    if (userProfile) {
      console.log(userProfile);
      dispatch(appActions.setUserProfile(null));
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
    user,
    userProfile,
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
