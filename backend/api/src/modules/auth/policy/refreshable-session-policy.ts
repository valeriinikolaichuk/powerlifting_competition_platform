import { SessionPolicyInterface } from "./session-policy.interface";
import { UserRole } from "@prisma/client";
import type { StringValue } from 'ms';

export class RefreshableSessionPolicy implements SessionPolicyInterface {

    supports(role: UserRole): boolean {
        return role !== UserRole.USER;
    }

    accessTokenExpiresIn: StringValue = '15m';

    refreshTokenExpiresIn: StringValue = '7d';

    cookieMaxAge = 1000 * 60 * 60 * 24 * 7;

    issueRefreshToken = true;
}
