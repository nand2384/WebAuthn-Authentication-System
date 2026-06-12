export interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
