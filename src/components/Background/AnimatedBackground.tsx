import React from "react";
import { FloatingParticles } from "./FloatingParticles";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
}) => (
  <div className="font-inter bg-gray-200 dark:bg-gray-950 w-full min-h-screen relative overflow-hidden">
    <FloatingParticles />
    <div className="h-full w-full ">{children}</div>
  </div>
);

export default AnimatedBackground;
