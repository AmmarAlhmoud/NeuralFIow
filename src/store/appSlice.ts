import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Project, type Task } from "../types/workspace";

interface AppState {
  isDarkMode: boolean;
  projectModal: boolean | null;
  projectsData: Project[] | undefined;
  isTaskModal: boolean | null;
  clickTask: Task | null;
  isTaskDrawer: boolean | null;
  isConfirmationModal: boolean | null;
}

const initialState: AppState = {
  isDarkMode: localStorage.getItem("theme") === "dark",
  projectModal: null,
  projectsData: undefined,
  isTaskModal: null,
  clickTask: null,
  isTaskDrawer: null,
  isConfirmationModal: null,
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
    setTaskDrawer(state, action: PayloadAction<boolean>) {
      state.isTaskDrawer = action.payload;
    },
    setConfirmationModal(state, action: PayloadAction<boolean>) {
      state.isConfirmationModal = action.payload;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
