import { useEffect, useState, useCallback } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { TimezoneProvider } from "./context/TimezoneProvider";
import { onAuthStateChanged } from "firebase/auth";
import { Toaster } from "react-hot-toast";
import { X, Check } from "lucide-react";
import type { AuthUser } from "./types/auth";
import { signOut } from "./firebase/auth";
import { auth } from "./firebase/config";
import { useSelector } from "react-redux";
import { type RootState } from "./store/store";
import MainPage from "./pages/Main";
import AuthPage from "./pages/Auth";
import DashboardPage from "./pages/Dashboard";
import ProjectsPage from "./pages/Projects";
import AnalyticsPage from "./pages/Analytics";
import SettingsPage from "./pages/Settings";
import ProtectedRouteWithUser from "./pages/ProtectedRouteWithUser";
import ProtectedRouteNoUser from "./pages/ProtectedRouteNoUser";
import AnimatedBackground from "./components/Background/AnimatedBackground";
import Loading from "./components/ui/Loading";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRouteWithUser>
        <AnimatedBackground>
          <MainPage />
        </AnimatedBackground>
      </ProtectedRouteWithUser>
    ),
    children: [
      {
        path: "workspace/:workspaceId",
        element: <DashboardPage />,
      },
      {
        path: "workspace/:workspaceId/project/:projectId",
        element: <ProjectsPage />,
      },
      { path: "workspace/:workspaceId/analytics", element: <AnalyticsPage /> },
      { path: "workspace/:workspaceId/settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "auth",
    element: (
      <ProtectedRouteNoUser>
        <AnimatedBackground>
          <AuthPage />
        </AnimatedBackground>
      </ProtectedRouteNoUser>
    ),
  },
]);

const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const isDarkMode = useSelector((state: RootState) => state.app.isDarkMode);
  const [loading, setLoading] = useState(true);

  // logout handler
  const logoutHandler = useCallback(async () => {
    try {
      // Sign out from Firebase
      await signOut();

      // Call backend to remove cookie
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setUser(null);
    }
  }, []);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          avatarURL: firebaseUser.photoURL,
        };
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Backend session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
          method: "POST",
          credentials: "include",
        });

        if (res.status === 401) {
          await logoutHandler();
        }
      } catch (err) {
        console.error("Session check failed:", err);
        await logoutHandler();
      }
    };

    // check immediately on load
    checkSession();

    // check every 30 seconds
    const interval = setInterval(checkSession, 30 * 1000);
    return () => clearInterval(interval);
  }, [logoutHandler]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (loading) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen flex justify-center items-center bg-gradient-animated text-white">
          <Loading />
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AuthProvider
      value={{
        user,
        isLoading: loading,
        message: undefined,
        handleAuthUser: (u) => setUser(u),
        logout: logoutHandler,
      }}
    >
      <TimezoneProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "rounded-2xl shadow-xl h-14",
            style: {
              background:
                "linear-gradient(-45deg, #0f0f23, #1a1a2e, #16213e, #0f0f23)",
              color: "#fff",
            },
            success: {
              icon: <Check className="h-5 w-5 text-green-600" />,
            },
            error: {
              icon: <X className="h-5 w-5 text-red-600" />,
            },
          }}
        />
      </TimezoneProvider>
    </AuthProvider>
  );
};

export default App;
