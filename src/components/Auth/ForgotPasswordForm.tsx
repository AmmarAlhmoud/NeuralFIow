import React, { useState } from "react";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { BrainIcon } from "../../assets/Icons/BrainIcon";
import { type ForgotPasswordFormData } from "../../types/auth";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void;
  onSwitchToLogin: () => void;
  isLoading: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  isLoading,
}) => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
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
    <div className="glassmorphic-white rounded-3xl p-6 neon-glow animate-fade-in">
      <BrainIcon />
      <h1 className="text-3xl font-bold dark:text-white text-black text-center mb-2">
        Reset Your Password
      </h1>
      <p className="dark:text-gray-400 text-gray-600 text-center mb-8 max-w-sm mx-auto">
        No worries! Enter your email and we'll send you a link to reset your
        password
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleInputChange}
          required
          icon={
            <svg
              className="w-5 h-5 dark:text-gray-400 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          }
        />

        <Button type="submit" size="lg-full" isLoading={isLoading}>
          {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t dark:border-gray-700 border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 glassmorphic dark:text-gray-400 text-gray-600">
              or
            </span>
          </div>
        </div>

        <p className="text-center dark:text-gray-400 text-gray-600">
          Remember your password?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-neon-scarlet hover:text-neon-fuchsia transition-colors duration-300 font-semibold"
          >
            Back to Sign In
          </button>
        </p>
      </form>
    </div>
  );
};
