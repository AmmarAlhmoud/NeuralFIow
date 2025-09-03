import { useState, useCallback } from "react";
import type {
  AuthState,
  AuthMode,
  // LoginFormData,
  // SignupFormData,
} from "../types/auth";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    mode: "login",
    isLoading: false,
    message: null,
  });

  const switchMode = useCallback((mode: AuthMode) => {
    setAuthState((prev) => ({ ...prev, mode, message: null }));
  }, []);

  const login = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, message: null }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAuthState((prev) => ({
      ...prev,
      isLoading: false,
      message: "Login successful! Welcome to your AI workspace.",
    }));
  }, []);

  const signup = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, message: null }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAuthState((prev) => ({
      ...prev,
      isLoading: false,
      message:
        "Account created successfully! Welcome to the future of productivity.",
    }));
  }, []);

  const socialLogin = useCallback(async (provider: "google" | "github") => {
    setAuthState((prev) => ({
      ...prev,
      message: `${provider} login integration would be implemented here.`,
    }));
  }, []);

  const clearMessage = useCallback(() => {
    setAuthState((prev) => ({ ...prev, message: null }));
  }, []);

  return {
    authState,
    switchMode,
    login,
    signup,
    socialLogin,
    clearMessage,
  };
};
