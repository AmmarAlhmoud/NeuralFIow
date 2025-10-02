interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "social" | "gradient";
  size?: "sm" | "md" | "md-full" | "lg" | "lg-full";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const sizeClasses: Record<string, string> = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    "md-full": "px-6 py-3 text-base rounded-xl w-full",
    lg: "px-6 py-3 text-lg rounded-2xl",
    "lg-full": "px-6 py-3 text-lg rounded-2xl w-full",
  };

  const baseClasses =
    "font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-neon-fuchsia to-neon-scarlet dark:text-white text-black hover:shadow-lg hover:shadow-neon-fuchsia/25",
    social:
      "dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 dark:text-white text-black font-medium dark:hover:bg-white/10 hover:bg-black/10 hover:neon-glow-cyan flex items-center justify-center space-x-3",
    gradient:
      "relative overflow-hidden bg-gradient-to-r from-neon-scarlet to-neon-fuchsia hover:from-neon-fuchsia hover:to-neon-scarlet text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
      {variant === "gradient" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
      )}
    </button>
  );
};
