import { useState, useCallback, useContext } from "react";
import { z } from "zod";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from "../firebase/auth";
import type {
  AuthState,
  AuthMode,
  LoginFormData,
  SignupFormData,
} from "../types/auth";
import { AuthContext } from "../context/AuthContext";
import { getIdTokenOrThrow } from "../firebase/auth";

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuth = () => {
  const { handleAuthUser } = useAuthContext();

  const [authState, setAuthState] = useState<AuthState>({
    mode: "login",
    isLoading: false,
    title: null,
    message: null,
  });

  const switchMode = useCallback((mode: AuthMode) => {
    setAuthState((prev) => ({ ...prev, mode, message: null, title: null }));
  }, []);

  // LOGIN
  const login = useCallback(
    async (loginData: LoginFormData) => {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        message: null,
        title: null,
      }));

      const schema = z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      });

      const result = schema.safeParse(loginData);
      if (!result.success) {
        const message = result.error.issues
          .map((issue) => issue.message)
          .join("\n");
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          title: "Oops!",
          message,
        }));
        return;
      }

      try {
        const userCredential = await signInWithEmail({
          email: loginData.email,
          password: loginData.password,
        });

        const firebaseUser = userCredential.user;

        const token = await getIdTokenOrThrow();
        await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        handleAuthUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? "",
          name: firebaseUser.displayName ?? null,
          avatarURL: firebaseUser.photoURL ?? null,
          provider: firebaseUser.providerData[0].providerId ?? null,
        });

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          title: "Success",
          message: "Login successful! Welcome back to NeuralFlow.",
        }));
      } catch (error: unknown) {
        let message = "Something went wrong with your login. Please try again.";
        if (error instanceof Error) {
          if (error.message === "Firebase: Error (auth/invalid-credential).") {
            message = "Invalid email or password.";
          }
        }
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          title: "Oops!",
          message,
        }));
      }
    },
    [handleAuthUser]
  );

  // SIGNUP (email/password)
  const signup = useCallback(
    async (signupData: SignupFormData) => {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        message: null,
        title: null,
      }));

      const schema = z
        .object({
          fullName: z
            .string()
            .min(2, "Full name must be at least 2 characters"),
          email: z.email("Invalid email address"),
          password: z.string().min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });

      const result = schema.safeParse(signupData);
      if (!result.success) {
        const message = result.error.issues
          .map((issue) => issue.message)
          .join("\n");
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          title: "Oops!",
          message,
        }));
        return;
      }

      try {
        const userCredential = await signUpWithEmail({
          email: signupData.email,
          password: signupData.password,
          name: signupData.fullName,
          avatarURL: "https://www.gravatar.com/avatar/?d=mp",
        });

        const firebaseUser = userCredential.user;

        const freshUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? "",
          name: firebaseUser.displayName ?? signupData.fullName ?? null,
          avatarURL: firebaseUser.photoURL ?? null,
          provider: firebaseUser.providerData[0].providerId ?? null,
        };

        // Write user to DB on the backend
        const token = await getIdTokenOrThrow();
        await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        handleAuthUser(freshUser);

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          title: "Success",
          message:
            "Account created successfully! Welcome to the future of productivity.",
        }));
      } catch (error: unknown) {
        let message =
          "Something went wrong with your signup. Please try again.";
        if (error instanceof Error) {
          if (
            error.message === "Firebase: Error (auth/email-already-in-use)."
          ) {
            message = "Email is already in use.";
          } else if (
            error.message === "Firebase: Error (auth/invalid-credential)."
          ) {
            message = "Invalid email or password.";
          }
        }

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          title: "Oops!",
          message,
        }));
      }
    },
    [handleAuthUser]
  );

  // SOCIAL LOGIN (Google only; GitHub placeholder)
  const socialLogin = useCallback(
    async (provider: "google" | "github") => {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        title: null,
        message: null,
      }));

      if (provider === "google") {
        try {
          const userCredential = await signInWithGoogle();
          const firebaseUser = userCredential.user;

          const freshUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? "",
            name: firebaseUser.displayName ?? null,
            avatarURL: firebaseUser.photoURL ?? null,
            provider: firebaseUser.providerData[0].providerId ?? null,
          };

          // Bootstrap backend user
          const token = await getIdTokenOrThrow();
          await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });

          handleAuthUser(freshUser);

          setAuthState((prev) => ({
            ...prev,
            title: "Success",
            isLoading: false,
            message: "Google login successful! Welcome to NeuralFlow.",
          }));
        } catch (error: unknown) {
          let message = "Google sign-in failed. Please try again.";
          if (error instanceof Error) {
            const e = error.message;
            if (e === "Firebase: Error (auth/popup-closed-by-user).") {
              message = "Sign-in popup was closed.";
            } else if (e === "Firebase: Error (auth/popup-blocked).") {
              message = "Popup blocked by the browser.";
            } else if (
              e === "Firebase: Error (auth/cancelled-popup-request)."
            ) {
              message = "Another sign-in is in progress.";
            } else if (
              e ===
              "Firebase: Error (auth/account-exists-with-different-credential)."
            ) {
              message = "An account with this email already exists.";
            }
          }
          setAuthState((p) => ({
            ...p,
            isLoading: false,
            title: "Oops!",
            message,
          }));
        }
      } else if (provider === "github") {
        // TODO: FUTURE IMPLEMENTATION Placeholder for GitHub login integration
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          title: "Info",
          message: `${provider} login integration would be implemented here.`,
        }));
      }
    },
    [handleAuthUser]
  );

  const clearMessage = useCallback(() => {
    setAuthState((prev) => ({ ...prev, title: null, message: null }));
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
