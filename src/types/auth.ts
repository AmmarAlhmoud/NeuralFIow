export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type AuthMode = "login" | "signup";
export type AuthFnType = {
  email: string;
  password: string;
  name?: string;
  avatarURL?: string;
};

export interface AuthState {
  mode: AuthMode;
  isLoading: boolean;
  title: string | null;
  message: string | null;
}

export interface AuthUser {
  _id?: string;
  uid: string;
  email: string | null;
  name: string | null;
  avatarURL: string | null;
  position?: string;
  provider?: string | null;
  isOnline?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  message?: string;
  handleAuthUser: (firebaseUser: AuthUser) => void;
  logout: () => Promise<void>;
}

export type Role = "admin" | "manager" | "member" | "viewer";
