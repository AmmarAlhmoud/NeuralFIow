import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { BrainIcon } from "../../assets/Icons/BrainIcon";
import { type SignupFormData } from "../../types/auth";

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  onSwitchToLogin: () => void;
  isLoading: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  isLoading,
}) => {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glassmorphic rounded-3xl p-8 neon-glow animate-fade-in">
      <BrainIcon />
      <h1 className="text-3xl font-bold dark:text-white text-black text-center mb-2">
        Join the Future
      </h1>
      <p className="dark:text-gray-400 text-gray-800 text-center mb-8">
        Create your AI-powered workspace
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          name="fullName"
          placeholder="Full name"
          value={formData.fullName}
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          }
        />

        <Input
          type="email"
          name="email"
          placeholder="Email address"
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
          placeholder="Create password"
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

        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          }
        />

        <Button type="submit" isLoading={isLoading}>
          Create Account
        </Button>

        <p className="text-center dark:text-gray-400 text-gray-800 mt-8">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-neon-scarlet hover:text-neon-fuchsia transition-colors duration-300 font-medium"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
};
