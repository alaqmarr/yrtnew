export type UserRole = "admin" | "staff" | "client" | "superadmin";

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  department: string | null;
  branch_id: string | null;
  branch_city?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  department?: string | null;
  branch_id?: string | null;
  is_active?: boolean;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string | null;
  role?: UserRole;
  department?: string | null;
  branch_id?: string | null;
  is_active?: boolean;
  password?: string;
}
