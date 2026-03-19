export type UserRole = "OPS" | "FINANCE";

export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
}

