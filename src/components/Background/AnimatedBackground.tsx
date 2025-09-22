import React from "react";
import { FloatingParticles } from "./FloatingParticles";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
}) => (
  <div className="font-inter bg-white dark:bg-gray-950 w-full min-h-screen relative overflow-hidden">
    <FloatingParticles />
    <div className="w-full h-full">{children}</div>
  </div>
);

export default AnimatedBackground;
