import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  size: number;
  color: string;
  top: string;
  left: string;
  delay: number;
}

export const FloatingParticles: React.FC = () => {
  const [particles] = useState<Particle[]>([
    { id: 1, size: 2, color: "neon-violet", top: "20%", left: "10%", delay: 0 },
    { id: 2, size: 1, color: "neon-cyan", top: "60%", left: "80%", delay: 2 },
    { id: 3, size: 3, color: "neon-violet", top: "80%", left: "20%", delay: 4 },
    { id: 4, size: 1, color: "neon-cyan", top: "30%", left: "70%", delay: 1 },
    { id: 5, size: 2, color: "neon-violet", top: "10%", left: "60%", delay: 3 },
  ]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Helper function to get size classes
  const getSizeClasses = (size: number) => {
    switch (size) {
      case 1:
        return "w-1 h-1";
      case 2:
        return "w-2 h-2";
      case 3:
        return "w-3 h-3";
      default:
        return "w-2 h-2";
    }
  };

  // Helper function to get color classes
  const getColorClasses = (color: string) => {
    switch (color) {
      case "neon-violet":
        return "bg-violet-500";
      case "neon-cyan":
        return "bg-cyan-500";
      default:
        return "bg-violet-500";
    }
  };

  return (
    <>
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          className={`absolute ${getSizeClasses(
            particle.size
          )} ${getColorClasses(
            particle.color
          )} opacity-30 rounded-full pointer-events-none animate-float`}
          style={{
            top: particle.top,
            left: particle.left,
            animationDelay: `${particle.delay}s`,
            transform: `translate(${mousePosition.x * (index + 1) * 0.01}px, ${
              mousePosition.y * (index + 1) * 0.01
            }px)`,
            transition: "transform 0.1s ease-out",
            zIndex: 100,
          }}
        />
      ))}
    </>
  );
};
