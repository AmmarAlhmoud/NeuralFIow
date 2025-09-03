import React from "react";

const AnalyticsPage: React.FC = () => {
  const metrics = [
    {
      value: "1,847",
      label: "Tasks Auto-Prioritized",
      change: "+34% this week",
      gradient: "from-violet-400 to-purple-400",
    },
    {
      value: "623",
      label: "Subtasks Generated",
      change: "+28% this week",
      gradient: "from-cyan-400 to-blue-400",
    },
    {
      value: "156",
      label: "Hours Saved",
      change: "+45% this week",
      gradient: "from-green-400 to-emerald-400",
    },
    {
      value: "94.2%",
      label: "AI Accuracy",
      change: "+2.1% this week",
      gradient: "from-orange-400 to-red-400",
    },
  ];

  return (
    <div className="px-6 pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r dark:from-white dark:to-gray-300 from-black to-gray-700 bg-clip-text text-transparent mb-2">
          Neural Analytics
        </h1>
        <p className="dark:text-gray-400 text-gray-800">
          AI-powered insights and performance metrics
        </p>
      </div>

      <div className="glassmorphic rounded-2xl p-8">
        <h3 className="text-xl font-semibold dark:text-white text-black mb-6">
          AI Neural Network Usage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div
                className={`text-4xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent mb-2`}
              >
                {metric.value}
              </div>
              <div className="text-sm dark:text-gray-400 text-gray-800 mb-2">
                {metric.label}
              </div>
              <div className="text-xs dark:text-green-400 text-green-800">
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
