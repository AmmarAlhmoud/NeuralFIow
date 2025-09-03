import React from "react";
import { TrendingUp } from "lucide-react";
import { type StatsCardProps } from "../../types/dashboard";

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  value,
  label,
  change,
  changeText,
  isPositive,
  bgColor,
}) => {
  return (
    <div className="glassmorphic rounded-2xl p-6 hover:neon-glow transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r dark:from-white dark:to-gray-300 from-black to-gray-500 bg-clip-text text-transparent">
            {value}
          </div>
          <div className="text-sm dark:text-gray-400 text-black font-medium">{label}</div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div
          className={`flex items-center space-x-1 ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">{change}</span>
        </div>
        <span className="text-xs text-gray-500">{changeText}</span>
      </div>
    </div>
  );
};

export default StatsCard;
