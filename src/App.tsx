import { useEffect, useState, useCallback } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import type { AuthUser } from "./types/auth";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "./firebase/auth";
import { auth } from "./firebase/config";
import HomePage from "./pages/Home";
import AuthPage from "./pages/Auth";
import ProtectedRouteWithUser from "./pages/ProtectedRouteWithUser";
import ProtectedRouteNoUser from "./pages/ProtectedRouteNoUser";
import AnimatedBackground from "./components/Background/AnimatedBackground";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRouteWithUser>
        <AnimatedBackground>
          <HomePage />
        </AnimatedBackground>
      </ProtectedRouteWithUser>
    ),
    children: [
      { path: "", element: <HomePage /> },
      { path: "analytics", element: <HomePage /> },
      { path: "settings", element: <HomePage /> },
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

  if (loading) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen flex justify-center items-center bg-gradient-animated text-white">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-white"></div>
          </div>
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
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
