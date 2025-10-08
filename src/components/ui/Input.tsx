import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  isDateTime?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, isDateTime, disabled, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div
            className={`absolute inset-y-0 ${
              isDateTime ? "right-0 pr-4" : "left-0 pl-4"
            } flex items-center pointer-events-none`}
          >
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${
            icon && !isDateTime
              ? props.type === "color"
                ? "pl-7"
                : "pl-12"
              : "pl-4"
          }  pr-4 py-3 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-2xl ${
            disabled
              ? "text-gray-600 dark:text-gray-400 cursor-not-allowed"
              : "dark:text-white  text-black cursor-text"
          }  dark:placeholder-gray-400 placeholder-gray-800 focus:outline-none input-glow transition-all duration-300 ${className}`}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
