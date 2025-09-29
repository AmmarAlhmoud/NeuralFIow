import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-black dark:border-white"></div>
    </div>
  );
};

export default Loading;
