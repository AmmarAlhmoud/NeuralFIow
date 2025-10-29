import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase/config";
import { Input } from "../components/UI/Input";
import { Button } from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import { BrainIcon } from "../assets/Icons/BrainIcon";
import { Lock, Eye, EyeOff } from "lucide-react";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get all params from URL
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidCode, setIsValidCode] = useState(false);

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const showModal = (title: string, message: string) => {
    setModalState({ isOpen: true, title, message });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: "", message: "" });

    // If success modal, redirect to login
    if (modalState.title === "Success") {
      navigate("/auth");
    }
  };

  useEffect(() => {
    // Verify the reset code when page loads
    const verifyCode = async () => {
      if (!oobCode) {
        setIsVerifying(false);
        setIsValidCode(false);
        showModal("Oops!", "Invalid or missing reset code");
        return;
      }

      // Check if mode is resetPassword
      if (mode && mode !== "resetPassword") {
        setIsVerifying(false);
        setIsValidCode(false);
        showModal("Oops!", "Invalid action mode");
        return;
      }

      try {
        // Verify the password reset code and get the email
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setIsValidCode(true);
      } catch (error) {
        console.error("Verify code error:", error);
        setIsValidCode(false);
        if (error instanceof Error) {
          if (error.message.includes("expired-action-code")) {
            showModal(
              "Oops!",
              "Reset link has expired. Please request a new one."
            );
          } else if (error.message.includes("invalid-action-code")) {
            showModal("Oops!", "Invalid reset link. Please request a new one.");
          } else {
            showModal("Oops!", "Something went wrong. Please try again.");
          }
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (newPassword.length < 8) {
      showModal("Oops!", "Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      showModal("Oops!", "Passwords do not match");
      return;
    }

    if (!oobCode) {
      showModal("Oops!", "Invalid reset code");
      return;
    }

    setIsLoading(true);

    try {
      // Reset the password using Firebase
      await confirmPasswordReset(auth, oobCode, newPassword);

      showModal(
        "Success",
        "Password reset successful! Redirecting to login..."
      );
    } catch (error) {
      console.error("Reset password error:", error);
      if (error instanceof Error) {
        if (error.message.includes("weak-password")) {
          showModal(
            "Oops!",
            "Password is too weak. Please use a stronger password."
          );
        } else if (error.message.includes("expired-action-code")) {
          showModal(
            "Oops!",
            "Reset link has expired. Please request a new one."
          );
        } else if (error.message.includes("invalid-action-code")) {
          showModal("Oops!", "Invalid reset code. Please request a new one.");
        } else {
          showModal("Oops!", "Failed to reset password. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="glassmorphic-white rounded-3xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Verifying reset link...</p>
      </div>
    );
  }

  if (!isValidCode) {
    return (
      <div className="glassmorphic-white rounded-3xl p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
          Invalid Reset Link
        </h1>
        <p className="text-gray-700 dark:text-gray-400 mb-6">
          This password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <Button onClick={() => navigate("/auth")} size="lg-full">
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="glassmorphic-white rounded-3xl p-8 neon-glow w-full max-w-md animate-fade-in">
        <BrainIcon />
        <h1 className="text-3xl font-bold dark:text-white text-black text-center mb-2">
          Create New Password
        </h1>
        <p className="dark:text-gray-400 text-gray-600 text-center mb-2">
          Enter a strong password for your account
        </p>
        <p className="text-sm dark:text-gray-500 text-gray-500 text-center mb-8">
          Resetting password for:{" "}
          <span className="font-semibold text-violet-400">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                icon={
                  <Lock className="w-5 h-5 dark:text-gray-400 text-gray-600" />
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
            <p className="text-xs dark:text-gray-500 text-gray-600 mt-1">
              Must be at least 8 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                icon={
                  <Lock className="w-5 h-5 dark:text-gray-400 text-gray-600" />
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
          </div>

          {newPassword && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`h-1 flex-1 rounded transition-all duration-300 ${
                    newPassword.length >= 8 ? "bg-green-500" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`h-1 flex-1 rounded transition-all duration-300 ${
                    newPassword.length >= 10 ? "bg-green-500" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`h-1 flex-1 rounded transition-all duration-300 ${
                    /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                ></div>
              </div>
              <p className="text-xs dark:text-gray-500 text-gray-600">
                {newPassword.length >= 10 &&
                /[A-Z]/.test(newPassword) &&
                /[0-9]/.test(newPassword)
                  ? "✓ Strong password"
                  : "Use 10+ characters with uppercase and numbers for a stronger password"}
              </p>
            </div>
          )}

          <Button type="submit" size="lg-full" isLoading={isLoading}>
            {isLoading ? "Resetting Password..." : "Reset Password"}
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

          <p className="text-center text-sm dark:text-gray-400 text-gray-600">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="text-neon-scarlet hover:text-neon-fuchsia transition-colors duration-300 font-semibold"
            >
              Back to Sign In
            </button>
          </p>
        </form>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
      />
    </>
  );
};

export default ResetPasswordPage;
