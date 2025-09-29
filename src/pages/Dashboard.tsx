import React from "react";
import { Check, Star, Target, Users, Plus } from "lucide-react";
import StatsCard from "../components/Dashboard/StatsCard";
import { Button } from "../components/ui/Button";
import ProjectCard from "../components/Dashboard/ProjectCard";
import Loading from "../components/ui/Loading";
import { appActions } from "../store/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store/store";

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.app.projectsData);

  const columns = [
    { id: "active", title: "Active", color: "bg-green-500" },
    { id: "archived", title: "Archived", color: "bg-gray-400" },
    { id: "completed", title: "Completed", color: "bg-cyan-500" },
  ];

  let projectsList: React.ReactNode;

  if (projects === undefined) {
    projectsList = (
      <div className="text-sm text-center min-h-38 mt-36">
        <Loading />
      </div>
    );
  }

  if (projects !== undefined && projects?.length === 0) {
    projectsList = (
      <div className="text-lg min-h-38 mt-36 text-gray-700 dark:text-gray-500 text-center">
        No projects available
      </div>
    );
  }

  if (projects !== undefined && projects?.length > 0) {
    projectsList = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-134 max-h-134 overflow-y-scroll custom-scrollbar">
        {columns.map((column) => {
          const columnProjects = projects.filter(
            (project) => project.status === column.id
          );
          const count = columnProjects.length;
          return (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 ${column.color} rounded-full ${
                      column.id === "active" ? "animate-pulse" : ""
                    }`}
                  ></div>
                  <h3 className="text-lg font-semibold dark:text-gray-300 text-black">
                    {column.title}
                  </h3>
                </div>
                <span
                  className={`bg-${column.color.split("-")[0]}-700 text-${
                    column.color
                  } px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {count}
                </span>
              </div>

              <div className="w-full py-2 px-4 flex flex-col space-y-4">
                {projects
                  .filter((project) => project.status === column.id)
                  .map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<Check className="w-6 h-6 text-white" />}
          value="247"
          label="Active Tasks"
          change="+12.5%"
          changeText="vs last week"
          isPositive={true}
          bgColor="from-violet-500 to-purple-600"
        />
        <StatsCard
          icon={<Star className="w-6 h-6 text-white" />}
          value="1,847"
          label="AI Automations"
          change="+34.2%"
          changeText="efficiency boost"
          isPositive={true}
          bgColor="from-cyan-500 to-blue-600"
        />
        <StatsCard
          icon={<Target className="w-6 h-6 text-white" />}
          value="89.3%"
          label="Completion Rate"
          change="+5.7%"
          changeText="this month"
          isPositive={true}
          bgColor="from-green-500 to-emerald-600"
        />
        <StatsCard
          icon={<Users className="w-6 h-6 text-white" />}
          value="24"
          label="Team Members"
          change="+3 new"
          changeText="this week"
          isPositive={true}
          bgColor="from-orange-500 to-red-600"
        />
      </div>

      <div className="glassmorphic rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r dark:from-white dark:to-gray-300 from-black to-gray-300 bg-clip-text text-transparent mb-2">
              Neural Project Board
            </h2>
            <p className="dark:text-gray-400 text-gray-700">
              AI-powered task management with intelligent prioritization
            </p>
          </div>
          <Button
            type="button"
            variant="gradient"
            className="flex space-x-2 px-4 py-0"
            onClick={() => dispatch(appActions.setProjectModal(true))}
          >
            <Plus />
            <span>Create Project</span>
          </Button>
        </div>

        {projectsList}
      </div>
    </div>
  );
};

export default DashboardPage;
