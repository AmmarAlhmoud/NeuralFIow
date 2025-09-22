import { type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { type AuthContextType } from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
  value: AuthContextType;
}

export const AuthProvider = ({ children, value }: AuthProviderProps) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
