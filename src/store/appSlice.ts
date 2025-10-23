import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type UserProfileSettings,
  type Project,
  type Task,
  type TeamMember,
  type WorkspaceFormSettings,
} from "../types/workspace";
import type { AuthUser } from "../types/auth";
import type { InvitationStatus } from "../types/notification";

interface AppState {
  isDarkMode: boolean;
  projectModal: boolean | null;
  projectsData: Project[] | undefined;
  isTaskModal: boolean | null;
  clickTask: Task | null;
  clickProject: Project | null;
  isTaskDrawer: boolean | null;
  isConfirmationModal: boolean | null;
  isInviteMembersModal: boolean | null;
  clickTeamMember: TeamMember | null;
  workspaceSettings: WorkspaceFormSettings | null;
  deletedWorkspaceId: string | null;
  userProfile: AuthUser | null;
  updateUserProfile: UserProfileSettings | null;
  isLogout: boolean | null;
  invitationStatus: InvitationStatus | null;
  markAsRead: string | null;
  deletedNoteId: string | null;
  isMarkAllAsRead: boolean | null;
  isAllNotesDeleted: boolean | null;
  currentTaskId: string | null;
}

const initialState: AppState = {
  isDarkMode: localStorage.getItem("theme") === "dark",
  projectModal: null,
  projectsData: undefined,
  isTaskModal: null,
  clickTask: null,
  clickProject: null,
  isTaskDrawer: null,
  isConfirmationModal: null,
  isInviteMembersModal: null,
  clickTeamMember: null,
  workspaceSettings: null,
  deletedWorkspaceId: null,
  userProfile: null,
  updateUserProfile: null,
  isLogout: null,
  invitationStatus: null,
  markAsRead: null,
  deletedNoteId: null,
  isMarkAllAsRead: null,
  isAllNotesDeleted: null,
  currentTaskId: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;

      if (state.isDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    },
    setProjectModal(state, action: PayloadAction<boolean>) {
      state.projectModal = action.payload;
    },
    setProjectsData(state, action: PayloadAction<Project[]>) {
      state.projectsData = action.payload;
    },
    setTaskModal(state, action: PayloadAction<boolean>) {
      state.isTaskModal = action.payload;
    },
    setClickTask(state, action: PayloadAction<Task | null>) {
      state.clickTask = action.payload;
    },
    setClickProject(state, action: PayloadAction<Project | null>) {
      state.clickProject = action.payload;
    },
    setTaskDrawer(state, action: PayloadAction<boolean>) {
      state.isTaskDrawer = action.payload;
    },
    setIsConfirmationModal(state, action: PayloadAction<boolean>) {
      state.isConfirmationModal = action.payload;
    },
    setInviteMembersModal(state, action: PayloadAction<boolean>) {
      state.isInviteMembersModal = action.payload;
    },
    setClickTeamMember(state, action: PayloadAction<TeamMember | null>) {
      state.clickTeamMember = action.payload;
    },
    setWorkspaceSettings(
      state,
      action: PayloadAction<WorkspaceFormSettings | null>
    ) {
      state.workspaceSettings = action.payload;
    },
    setDeletedWorkspaceId(state, action: PayloadAction<string | null>) {
      state.deletedWorkspaceId = action.payload;
    },
    setUserProfile(state, action: PayloadAction<AuthUser | null>) {
      state.userProfile = action.payload;
    },
    setUpdateUserProfile(
      state,
      action: PayloadAction<UserProfileSettings | null>
    ) {
      state.updateUserProfile = action.payload;
    },
    setIsLogout(state, action: PayloadAction<boolean | null>) {
      state.isLogout = action.payload;
    },
    setInvitationStatus(state, action: PayloadAction<InvitationStatus | null>) {
      state.invitationStatus = action.payload;
    },
    setMarkAsRead(state, action: PayloadAction<string | null>) {
      state.markAsRead = action.payload;
    },
    setIsMarkAllAsRead(state, action: PayloadAction<boolean | null>) {
      state.isMarkAllAsRead = action.payload;
    },
    setDeletedNoteId(state, action: PayloadAction<string | null>) {
      state.deletedNoteId = action.payload;
    },
    setIsAllNotesDeleted(state, action: PayloadAction<boolean | null>) {
      state.isAllNotesDeleted = action.payload;
    },
    setCurrentTaskId(state, action: PayloadAction<string | null>) {
      state.currentTaskId = action.payload;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
