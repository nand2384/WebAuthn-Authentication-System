export type UserRole =
  | "patient" 
  | "doctor" 
  | "receptionist" 
  | "admin";

export interface AuthUser {
  userId: string;
  role: UserRole;
}