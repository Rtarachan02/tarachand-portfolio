export interface AuthUser {
  id: number;
  email: string;
  full_name: string | null;
  is_admin: boolean;
}
