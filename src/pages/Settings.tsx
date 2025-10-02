import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAuthContext } from "../hooks/useAuth";
import Settings from "../components/Settings/Settings";
import { InviteMembersModal } from "../components/Settings/InviteMembersModal";
import type { TeamMember, Workspace } from "../types/workspace";
import type { AppDispatch, RootState } from "../store/store";
import { appActions } from "../store/appSlice";

const SettingsPage: React.FC = () => {
  const { user } = useAuthContext();
  const { workspaceId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [workspace, setWorkspace] = useState<Workspace | undefined>();

  const isInviteMembersModal = useSelector(
    (state: RootState) => state.app.isInviteMembersModal
  );
  const [invitedMember, setInvitedMember] = useState<TeamMember | null>();

  const inviteTeamMemberHandler = (formData: TeamMember) => {
    if (!user) {
      toast.error("Failed to invite team member try again");
      return;
    }

    setInvitedMember(formData);
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
        console.log(data);
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
          toast.error(data.message);
        }
      } catch (_) {
        toast.error("Failed to send invitation. Please try again.");
      }
    };
    // const updateTeamMember = async (member: TeamMember) => {
    //   try {
    //     await fetch(
    //       `${import.meta.env.VITE_API_URL}/tasks/${
    //         member._id
    //       }?workspaceId=${workspaceId}`,
    //       {
    //         method: "PATCH",
    //         credentials: "include",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(member),
    //       }
    //     );
    //     dispatch(appActions.setClickTask(null));
    //     toast.success("Member updated successfully!");
    //   } catch (_) {
    //     toast.error("Failed to update member. Please try again.");
    //   }
    // };
    // const removeTeamMember = async (member: TeamMember) => {
    //   try {
    //     await fetch(
    //       `${import.meta.env.VITE_API_URL}/tasks/${
    //         member._id
    //       }?workspaceId=${workspaceId}`,
    //       {
    //         method: "DELETE",
    //         credentials: "include",
    //       }
    //     );
    //     dispatch(appActions.setClickTask(null));
    //     toast.success("Task deleted successfully!");
    //   } catch (_) {
    //     toast.error("Failed to deleted Task. Please try again.");
    //   }
    // };

    if (invitedMember) {
      sendInvite(invitedMember);
      setInvitedMember(null);
    }

    if (user) {
      getWorkspaceTeamMembers();
    }
  }, [dispatch, invitedMember, user, workspaceId]);

  return (
    <>
      <Settings workspace={workspace} />
      {isInviteMembersModal && (
        <InviteMembersModal
          isOpen={isInviteMembersModal}
          onSubmit={inviteTeamMemberHandler}
        />
      )}
    </>
  );
};

export default SettingsPage;
