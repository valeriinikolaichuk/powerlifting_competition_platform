import { UserRole } from "@prisma/client";
import type { StringValue } from 'ms';

export interface SessionPolicyInterface {

    supports(role: UserRole): boolean;

    accessTokenExpiresIn: StringValue;

    refreshTokenExpiresIn: StringValue;

    cookieMaxAge: number;

    issueRefreshToken: boolean;
}
