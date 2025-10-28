import { type LoaderFunctionArgs, redirect } from "react-router-dom";
import type { TeamMember } from "../types/workspace";

interface ProtectedRouteLoaderOptions {
  allowedRoles?: string[];
  redirectTo?: string;
}

export const createProtectedRouteLoader = (
  options: ProtectedRouteLoaderOptions = {}
) => {
  const { allowedRoles = ["admin", "manager"], redirectTo = "/" } = options;

  return async ({ params }: LoaderFunctionArgs) => {
    const { workspaceId } = params;

    if (!workspaceId) {
      throw redirect(redirectTo);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}`,
        {
          credentials: "include",
        }
      );

      if (response.status === 401) {
        throw redirect("/auth");
      }

      if (response.status === 403) {
        throw redirect(redirectTo);
      }

      if (response.status === 404) {
        throw redirect(redirectTo);
      }

      if (!response.ok) {
        throw redirect(redirectTo);
      }

      const data = await response.json();

      if (!data.success) {
        throw redirect(redirectTo);
      }

      const workspace = data.data;
      const currentUser = data.currentUser;

      if (!currentUser) {
        throw redirect("/auth");
      }

      // Find user's role in workspace
      const member = workspace.members.find((m: TeamMember) => {
        const memberId =
          typeof m.uid === "string" ? m.uid : m?.uid?._id || m.uid;
        return memberId === currentUser._id;
      });

      const userRole = member?.role || "viewer";

      // Check if user has permission
      if (!allowedRoles.includes(userRole)) {
        throw redirect(redirectTo);
      }

      // Return data for the route
      return { workspace, userRole, currentUser };
    } catch (error) {
      if (error instanceof Response) {
        throw error;
      }

      console.error("Protected route loader error:", error);
      throw redirect(redirectTo);
    }
  };
};

// Pre-configured loaders
export const adminOnlyLoader = createProtectedRouteLoader({
  allowedRoles: ["admin"],
  redirectTo: "/",
});

export const managerOrAdminLoader = createProtectedRouteLoader({
  allowedRoles: ["admin", "manager"],
  redirectTo: "/",
});

export const allMembersLoader = createProtectedRouteLoader({
  allowedRoles: ["admin", "manager", "member", "viewer"],
  redirectTo: "/",
});
