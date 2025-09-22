import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuth";

interface ProtectedRouteNoUserProps {
  children: React.ReactNode;
}

const ProtectedRouteNoUser = ({ children }: ProtectedRouteNoUserProps) => {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRouteNoUser;
