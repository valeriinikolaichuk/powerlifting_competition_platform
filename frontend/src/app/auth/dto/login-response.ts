import { UserRole } from "../../shared/components/login-form/user-role";

export interface LoginResponse {
    success: boolean;
    message: string;
    role?: UserRole;
}
