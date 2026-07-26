import { UserRole } from "@prisma/client";

export class LoginResultDto {

    success: boolean = false;

    message: string = '';

    role?: UserRole;

    accessToken?: string;

    refreshToken?: string;
}
