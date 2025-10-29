import React from "react";
import { FloatingParticles } from "./FloatingParticles";

interface AnimatedAuthBackgroundProps {
  children: React.ReactNode;
}

const AnimatedAuthBackground: React.FC<AnimatedAuthBackgroundProps> = ({
  children,
}) => (
  <div className="font-inter bg-white dark:bg-gray-950 w-full min-h-screen relative overflow-hidden">
    <FloatingParticles />
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 dark:bg-none dark:bg-gray-950">
      {children}
    </div>
  </div>
);

export default AnimatedAuthBackground;
