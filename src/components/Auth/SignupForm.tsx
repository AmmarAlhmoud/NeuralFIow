import React, { useState } from "react";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { BrainIcon } from "../../assets/Icons/BrainIcon";
import { type SignupFormData } from "../../types/auth";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../../store/appSlice";
import type { RootState } from "../../store/store";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";

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
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDarkMode = useSelector((state: RootState) => state.app.isDarkMode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glassmorphic-white rounded-3xl p-8 neon-glow animate-fade-in">
      <BrainIcon />
      <h1 className="text-3xl font-bold dark:text-white text-black text-center mb-2">
        Join the Future
      </h1>
      <p className="dark:text-gray-400 text-gray-800 text-center mb-8">
        Create your AI-powered workspace
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

        <div className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
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

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
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

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-400 text-gray-600 hover:text-gray-400 transition-colors z-10"
            >
              {showConfirmPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`h-1 flex-1 rounded transition-all duration-300 ${
                    formData.password.length >= 8
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`h-1 flex-1 rounded transition-all duration-300 ${
                    formData.password.length >= 10
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`h-1 flex-1 rounded transition-all duration-300 ${
                    /[A-Z]/.test(formData.password) &&
                    /[0-9]/.test(formData.password)
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                ></div>
              </div>
              <p className="text-xs dark:text-gray-500 text-gray-600">
                {formData.password.length >= 10 &&
                /[A-Z]/.test(formData.password) &&
                /[0-9]/.test(formData.password)
                  ? "✓ Strong password"
                  : "Use 10+ characters with uppercase and numbers for a stronger password"}
              </p>
            </div>
          )}
        </div>

        <Button type="submit" size="lg-full" isLoading={isLoading}>
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
