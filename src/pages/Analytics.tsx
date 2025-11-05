import React from "react";
import { useSelector } from "react-redux";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  ListChecks,
  Clock,
  Target,
  FileText,
  Flag,
  CheckSquare,
  AlertCircle,
} from "lucide-react";
import type { RootState } from "../store/store";

const AnalyticsPage: React.FC = () => {
  const aiStats = useSelector((state: RootState) => state.app.aiStats);

  // Fallback metrics when data is unavailable
  const defaultMetrics = [
    {
      value: "0",
      label: "AI Automations",
      change: 0,
      changeText: "efficiency boost",
      gradient: "from-violet-400 to-purple-400",
      icon: Zap,
      bgGradient: "from-violet-500/10 to-purple-500/10",
      borderGradient: "from-violet-500/50 to-purple-500/50",
    },
    {
      value: "0",
      label: "Subtasks Generated",
      change: 0,
      changeText: "this week",
      gradient: "from-cyan-400 to-blue-400",
      icon: ListChecks,
      bgGradient: "from-cyan-500/10 to-blue-500/10",
      borderGradient: "from-cyan-500/50 to-blue-500/50",
    },
    {
      value: "0",
      label: "Hours Saved",
      change: 0,
      changeText: "this week",
      gradient: "from-green-400 to-emerald-400",
      icon: Clock,
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderGradient: "from-green-500/50 to-emerald-500/50",
    },
    {
      value: "0%",
      label: "AI Accuracy",
      change: 0,
      changeText: "this week",
      gradient: "from-orange-400 to-red-400",
      icon: Target,
      bgGradient: "from-orange-500/10 to-red-500/10",
      borderGradient: "from-orange-500/50 to-red-500/50",
    },
  ];

  const metrics = aiStats
    ? [
        {
          value: aiStats.automations?.total?.toLocaleString() ?? "0",
          label: "AI Automations",
          change: aiStats.automations?.efficiencyBoost ?? 0,
          changeText: "efficiency boost",
          gradient: "from-violet-400 to-purple-400",
          icon: Zap,
          bgGradient: "from-violet-500/10 to-purple-500/10",
          borderGradient: "from-violet-500/50 to-purple-500/50",
        },
        {
          value: aiStats.subtasksGenerated?.total?.toLocaleString() ?? "0",
          label: "Subtasks Generated",
          change: aiStats.subtasksGenerated?.change ?? 0,
          changeText: "this week",
          gradient: "from-cyan-400 to-blue-400",
          icon: ListChecks,
          bgGradient: "from-cyan-500/10 to-blue-500/10",
          borderGradient: "from-cyan-500/50 to-blue-500/50",
        },
        {
          value: aiStats.hoursSaved?.total?.toString() ?? "0",
          label: "Hours Saved",
          change: aiStats.hoursSaved?.change ?? 0,
          changeText: "this week",
          gradient: "from-green-400 to-emerald-400",
          icon: Clock,
          bgGradient: "from-green-500/10 to-emerald-500/10",
          borderGradient: "from-green-500/50 to-emerald-500/50",
        },
        {
          value: aiStats.aiAccuracy?.rate
            ? `${aiStats.aiAccuracy.rate.toFixed(1)}%`
            : "0%",
          label: "AI Accuracy",
          change: aiStats.aiAccuracy?.change ?? 0,
          changeText: "this week",
          gradient: "from-orange-400 to-red-400",
          icon: Target,
          bgGradient: "from-orange-500/10 to-red-500/10",
          borderGradient: "from-orange-500/50 to-red-500/50",
        },
      ]
    : defaultMetrics;

  const getChangeIcon = (change: number) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500 dark:text-green-400";
    if (change < 0) return "text-red-500 dark:text-red-400";
    return "text-gray-500 dark:text-gray-400";
  };

  // Fallback breakdown data
  const breakdown = aiStats?.breakdown ?? {
    summaries: 0,
    priorities: 0,
    subtasks: 0,
  };

  const completionRate = aiStats?.completionRate ?? 0;

  return (
    <div className="px-6 pb-6 space-y-6">
      <div className="glassmorphic rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r dark:from-white dark:to-gray-300 from-black to-gray-700 bg-clip-text text-transparent mb-2">
              Neural Analytics
            </h1>
            <p className="dark:text-gray-400 text-gray-600 text-md">
              AI-powered insights and performance metrics
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {!aiStats && (
        <div className="glassmorphic rounded-2xl p-6 border border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold dark:text-white text-black">
                No Analytics Data Available
              </h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">
                Start using AI features to see your analytics here.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const ChangeIcon = getChangeIcon(metric.change);

          return (
            <div
              key={index}
              className="glassmorphic rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <div
                className={`relative w-full h-32 rounded-xl bg-gradient-to-br ${metric.bgGradient} border-2 border-transparent bg-clip-padding mb-4 group-hover:scale-105 transition-transform flex flex-col items-center justify-center`}
                style={{
                  borderImage: `linear-gradient(to bottom right, var(--tw-gradient-stops)) 1`,
                  borderImageSlice: 1,
                }}
              >
                <Icon
                  className={`w-8 h-8 mb-2 text-${metric.gradient
                    .split(" ")[0]
                    .replace("from-", "")}`}
                />

                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}
                >
                  {metric.value}
                </div>
              </div>

              <div className="text-sm dark:text-gray-400 text-gray-600 font-medium mb-3 text-center">
                {metric.label}
              </div>

              <div
                className={`flex items-center justify-center gap-1 text-sm font-semibold ${getChangeColor(
                  metric.change
                )}`}
              >
                {ChangeIcon && <ChangeIcon className="w-4 h-4" />}
                <span>
                  {metric.change > 0 ? "+" : ""}
                  {metric.change.toFixed(1)}%
                </span>
                <span className="text-xs font-normal dark:text-gray-500 text-gray-600">
                  {metric.changeText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glassmorphic rounded-2xl p-8 border border-white/10">
          <h3 className="text-xl font-semibold dark:text-white text-black mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            AI Feature Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm dark:text-gray-300 text-gray-700 font-medium">
                  Summaries Generated
                </span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {breakdown.summaries}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm dark:text-gray-300 text-gray-700 font-medium">
                  Priorities Analyzed
                </span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {breakdown.priorities}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm dark:text-gray-300 text-gray-700 font-medium">
                  Tasks with Subtasks
                </span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {breakdown.subtasks}
              </span>
            </div>
          </div>
        </div>

        <div className="glassmorphic rounded-2xl p-8 border border-white/10">
          <h3 className="text-xl font-semibold dark:text-white text-black mb-6 flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Task Completion
          </h3>
          <div className="flex flex-col items-center justify-center h-full py-6">
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-700 dark:text-gray-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 88 * (1 - completionRate / 100)
                  }`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {completionRate}%
                </span>
                <span className="text-sm dark:text-gray-400 text-gray-600 mt-1">
                  Completed
                </span>
              </div>
            </div>
            <p className="text-center dark:text-gray-400 text-gray-600 text-sm">
              {completionRate > 0
                ? "Tasks completion rate"
                : "No completed tasks yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
