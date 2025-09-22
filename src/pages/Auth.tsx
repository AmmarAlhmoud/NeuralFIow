import React, { useState, useEffect } from "react";
import { LoginForm } from "../components/Auth/LoginForm";
import { SignupForm } from "../components/Auth/SignupForm";
import { Modal } from "../components/ui/Modal";
import { useAuth } from "../hooks/useAuth";

const AuthPage: React.FC = () => {
  const [_isDarkMode, setIsDarkMode] = useState(false);
  const { authState, switchMode, login, signup, socialLogin, clearMessage } =
    useAuth();

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="w-full max-w-sm md:max-w-md mx-auto p-4">
      {authState.mode === "login" ? (
        <LoginForm
          onSubmit={login}
          onSocialLogin={socialLogin}
          onSwitchToSignup={() => switchMode("signup")}
          isLoading={authState.isLoading}
        />
      ) : (
        <SignupForm
          onSubmit={signup}
          onSwitchToLogin={() => switchMode("login")}
          isLoading={authState.isLoading}
        />
      )}

      <Modal
        isOpen={!!authState.message}
        onClose={clearMessage}
        title={authState.title || ""}
        message={authState.message || ""}
      />
    </div>
  );
};


export default AuthPage;