import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import type { AuthUser } from "./types/auth";
import { onAuthStateChanged } from "firebase/auth";
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

  const handleAuthUser = (firebaseUser: AuthUser) => {
    setUser(firebaseUser);
  };

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          avatarURL: firebaseUser.photoURL,
        };
        setUser(authUser);
        setLoading(false);
        localStorage.setItem("authUser", "true");
      } else {
        setUser(null);
        localStorage.removeItem("authUser");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen flex justify-center align-center mx-auto   bg-gradient-animated  text-white">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-white"></div>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  console.log("Current user:", user);

  return (
    <AuthProvider
      value={{
        user,
        isLoading: false,
        message: undefined,
        handleAuthUser,
        signOut: async () => {},
      }}
    >
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
