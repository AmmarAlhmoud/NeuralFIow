import React, { useState } from "react";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { GoogleIcon } from "../../assets/Icons/GoogleIcon";
// import { GitHubIcon } from "../../assets/Icons/GitHubIcon";
import { BrainIcon } from "../../assets/Icons/BrainIcon";
import { type LoginFormData } from "../../types/auth";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../../store/appSlice";
import type { RootState } from "../../store/store";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onSocialLogin: (provider: "google" | "github") => void;
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSocialLogin,
  onSwitchToSignup,
  onSwitchToForgotPassword,
  isLoading,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const isDarkMode = useSelector((state: RootState) => state.app.isDarkMode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="relative glassmorphic-white rounded-3xl p-6 neon-glow animate-fade-in">
      <BrainIcon />
      <h1 className="text-3xl font-bold dark:text-white text-black text-center mb-2">
        Welcome Back
      </h1>
      <p className="dark:text-gray-400 text-gray-800 text-center mb-8">
        Sign in to your AI workspace
      </p>

      <button
        onClick={() => dispatch(appActions.toggleTheme())}
        className="absolute -top-4 -left-4 p-3 rounded-2xl glassmorphic border dark:border-violet-500/20 border-violet-400/20 hover:border-violet-500/50 hover:scale-110 active:scale-95 transition-all duration-300 group backdrop-blur-xl shadow-md hover:shadow-violet-500/30"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? (
          <Moon className="w-5 h-5 text-violet-400 group-hover:text-yellow-300 transition-all duration-300 group-hover:rotate-12 drop-shadow-lg" />
        ) : (
          <Sun className="w-5 h-5 text-orange-600 group-hover:text-yellow-500 transition-all duration-300 group-hover:rotate-180 drop-shadow-lg" />
        )}
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
          icon={
            <svg
              className="w-5 h-5 dark:text-gray-400 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              ></path>
            </svg>
          }
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
            icon={
              <svg
                className="w-5 h-5 dark:text-gray-400 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-400 text-gray-600 hover:text-gray-400 transition-colors z-10"
          >
            {showPassword ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-end">
          {/* TODO: Feature for the future */}
          {/* <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-neon-scarlet bg-transparent border-gray-600 rounded focus:ring-neon-scarlet focus:ring-2"
            />
            <span className="ml-2 text-sm dark:text-gray-400 text-gray-800">
              Remember me
            </span>
          </label> */}
          <button
            type="button"
            className="text-sm text-neon-scarlet hover:text-neon-fuchsia transition-colors duration-300"
            onClick={onSwitchToForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" size="lg-full" isLoading={isLoading}>
          Sign In
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent dark:text-gray-400 text-gray-800">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="social"
            size="lg-full"
            onClick={() => onSocialLogin("google")}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </Button>
          {/* TODO: FUTURE IMPLEMENTATION Placeholder for GitHub login button */}
          {/* <Button
            type="button"
            variant="social"
            onClick={() => onSocialLogin("github")}
          >
            <GitHubIcon />
            <span>Continue with GitHub</span>
          </Button> */}
        </div>

        <p className="text-center dark:text-gray-400 text-gray-800 mt-8">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-neon-scarlet hover:text-neon-fuchsia transition-colors duration-300 font-medium"
          >
            Create one
          </button>
        </p>
      </form>
    </div>
  );
};
