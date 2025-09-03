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

export type AuthMode = 'login' | 'signup';

export interface AuthState {
  mode: AuthMode;
  isLoading: boolean;
  message: string | null;
}