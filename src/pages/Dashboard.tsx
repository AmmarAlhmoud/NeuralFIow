import React from "react";
import { Check, Star, Target, Users, Plus } from "lucide-react";
import TaskCard from "../components/Dashboard/TaskCard";
import StatsCard from "../components/Dashboard/StatsCard";
import { type Task } from "../types/dashboard";

interface DashboardPageProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  tasks,
  onTaskClick,
}) => {
  const columns = [
    { id: "todo", title: "To Do", count: 8, color: "gray-400" },
    { id: "inprogress", title: "In Progress", count: 5, color: "cyan-400" },
    { id: "done", title: "Done", count: 12, color: "green-400" },
  ];

  return (
    <div className="px-6 pb-6">
      {/* Stats Grid */}
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

      {/* Kanban Board */}
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
          <button className="relative overflow-hidden bg-gradient-to-r from-neon-scarlet to-neon-fuchsia hover:from-neon-fuchsia hover:to-neon-scarlet text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <span className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Task</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 bg-${column.color} rounded-full ${
                      column.id === "inprogress" ? "animate-pulse" : ""
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
                  {column.count}
                </span>
              </div>

              <div className="space-y-4">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onTaskClick={onTaskClick}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
