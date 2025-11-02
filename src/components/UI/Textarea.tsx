import React, { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: React.ReactNode;
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ icon, className = "", ...props }, ref) => {
    const commonClasses = `w-full ${
      icon ? "pl-12" : "pl-4"
    } pr-4 py-3 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-2xl dark:text-white text-black dark:placeholder-gray-400 placeholder-gray-800 focus:outline-none input-glow transition-all duration-300 ${className}`;

    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <textarea ref={ref} className={commonClasses} {...props} />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
