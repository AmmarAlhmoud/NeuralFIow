import React from "react";
import { Plus } from "lucide-react";
import type { Workspace } from "../types/workspace";
import { Button } from "../components/ui/Button";
import WorkspaceItem from "../components/Dashboard/WorkspaceItem";
import type { PageType } from "../types/dashboard";
import Loading from "../components/ui/Loading";
import HoverDisabler from "../components/ui/HoverDisabler";

interface HomePageProps {
  workspaces?: Workspace[];
  setWorkspacesModal?: (status: boolean) => void;
  currentPage?: PageType;
}

const HomePage: React.FC<HomePageProps> = ({
  workspaces,
  setWorkspacesModal,
  currentPage,
}) => {
  let content: React.ReactNode;
  let workspacesList: React.ReactNode;

  if (workspaces === undefined) {
    workspacesList = (
      <div className="text-sm text-gray-500 mt-40">
        <Loading />
      </div>
    );
  }

  if (workspaces !== undefined && workspaces?.length === 0) {
    workspacesList = (
      <div className="text-lg text-gray-700 dark:text-gray-500 text-center mt-40">
        No workspaces available
      </div>
    );
  }

  if (
    workspaces !== undefined &&
    currentPage === "home" &&
    workspaces?.length > 0
  ) {
    workspacesList = workspaces.map((workspace) => (
      <WorkspaceItem
        key={workspace._id}
        workspace={workspace}
        currentPage={currentPage}
      />
    ));
  }

  if (typeof setWorkspacesModal === "function") {
    content = (
      <div className="px-6 pb-6">
        <div className="glassmorphic rounded-2xl p-8">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Choose Workspace</h1>
            <Button
              type="button"
              variant="gradient"
              className="flex space-x-2"
              onClick={() => setWorkspacesModal(true)}
            >
              <Plus />
              <span>Create Workspace</span>
            </Button>
          </div>
          <HoverDisabler>
            <div className="h-full min-h-112 max-h-112 overflow-y-auto custom-scrollbar mt-8">
              {workspacesList}
            </div>
          </HoverDisabler>
        </div>
      </div>
    );
  }

  return content;
};

export default HomePage;
