import { useState, useCallback, useContext } from "react";
import { z } from "zod";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  sendPasswordReset,
} from "../firebase/auth";
import type {
  AuthState,
  AuthMode,
  LoginFormData,
  SignupFormData,
  ForgotPasswordFormData,
  AuthProviderType,
} from "../types/auth";
import { AuthContext } from "../context/AuthContext";
import { getIdTokenOrThrow } from "../firebase/auth";
import { connectSocket } from "../utils/socket";
import toast from "react-hot-toast";

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
          provider:
            (firebaseUser.providerData[0].providerId as AuthProviderType) ||
            "password",
        });
        connectSocket();

        toast.success("Welcome Back to NeuralFlow 🖐🏻");
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
          provider:
            (firebaseUser.providerData[0].providerId as AuthProviderType) ||
            "password",
        };

        // Write user to DB on the backend
        const token = await getIdTokenOrThrow();
        await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        handleAuthUser(freshUser);
        connectSocket();

        toast.success("Welcome to the future of productivity");
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

  // FORGOT PASSWORD (email)
  const forgotPassword = useCallback(
    async (forgotPasswordData: ForgotPasswordFormData) => {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        message: null,
        title: null,
      }));

      const schema = z.object({
        email: z.email("Invalid email address"),
      });

      const result = schema.safeParse(forgotPasswordData);
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
        const checkResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/check-provider`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: forgotPasswordData.email }),
          }
        );

        const providerData = await checkResponse.json();

        // If user signed up with Google, block password reset
        if (providerData.provider === "google.com") {
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
            title: "Oops!",
            message:
              "This account uses Google Sign-In. Please sign in with Google instead.",
          }));
          return;
        }

        await sendPasswordReset(forgotPasswordData.email);

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          title: "Success",
          message: `Password reset email sent to ${forgotPasswordData.email}. Please check your inbox.`,
        }));

        setTimeout(() => {
          switchMode("login");
        }, 3000);
      } catch (error: unknown) {
        let message = "Failed to send password reset email. Please try again.";
        if (error instanceof Error) {
          if (error.message.includes("user-not-found")) {
            message =
              "If this email is registered, you will receive a password reset link.";
          } else if (error.message.includes("invalid-email")) {
            message = "Invalid email address.";
          } else if (error.message.includes("too-many-requests")) {
            message = "Too many requests. Please try again later.";
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
    [switchMode]
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
            provider:
              (firebaseUser.providerData[0].providerId as AuthProviderType) ||
              "password",
          };

          // Bootstrap backend user
          const token = await getIdTokenOrThrow();
          await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });

          handleAuthUser(freshUser);

          toast.success("Welcome to NeuralFlow 🖐🏻");
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
    forgotPassword,
    socialLogin,
    clearMessage,
  };
};
