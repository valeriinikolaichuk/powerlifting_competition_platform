import { UserRole } from "../enums/user-role";

export interface LoginResponse {
    success: boolean;
    message: string;
    role?: UserRole;
}
