import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${
            icon ? (props.type === "color" ? "pl-7" : "pl-12") : "pl-4"
          }  pr-4 py-3 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-2xl dark:text-white  text-black dark:placeholder-gray-400 placeholder-gray-800 focus:outline-none input-glow transition-all duration-300 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
