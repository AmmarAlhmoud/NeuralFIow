import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import { AnimatedBackground } from "./components/Background/AnimatedBackground";
import { AuthPage } from "./pages/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AnimatedBackground>
        <HomePage />
      </AnimatedBackground>
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
      <AnimatedBackground>
        <AuthPage />
      </AnimatedBackground>
    ),
  },
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
