import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { GoogleIcon } from "../../assets/Icons/GoogleIcon";
import { GitHubIcon } from "../../assets/Icons/GitHubIcon";
import { BrainIcon } from "../../assets/Icons/BrainIcon";
import { type LoginFormData } from "../../types/auth";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onSocialLogin: (provider: "google" | "github") => void;
  onSwitchToSignup: () => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSocialLogin,
  onSwitchToSignup,
  isLoading,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

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
    <div className="glassmorphic  rounded-3xl p-6 neon-glow animate-fade-in ">
      <BrainIcon />
      <h1 className="text-3xl font-bold dark:text-white text-black text-center mb-2">
        Welcome Back
      </h1>
      <p className="dark:text-gray-400 text-gray-800 text-center mb-8">
        Sign in to your AI workspace
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <Input
          type="password"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center">
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
          </label>
          <button
            type="button"
            className="text-sm text-neon-scarlet hover:text-neon-fuchsia transition-colors duration-300"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" isLoading={isLoading}>
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
            onClick={() => onSocialLogin("google")}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </Button>

          <Button
            type="button"
            variant="social"
            onClick={() => onSocialLogin("github")}
          >
            <GitHubIcon />
            <span>Continue with GitHub</span>
          </Button>
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
