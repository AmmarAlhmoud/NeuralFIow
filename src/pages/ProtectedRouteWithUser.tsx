import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";

interface ProtectedRouteWithUserProps {
  children: React.ReactNode;
}

const ProtectedRouteWithUser = ({ children }: ProtectedRouteWithUserProps) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRouteWithUser;
