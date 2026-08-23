import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginContext } from '../login-context';
import { SessionPolicyInterface } from '../policy/session-policy.interface';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async generateAccessToken(
        context: LoginContext,
        policy: SessionPolicyInterface,
    ): Promise<string> {

        return this.jwtService.signAsync(
            {
                sub: context.user.id,
            },
            {
                expiresIn: policy.accessTokenExpiresIn,
            },
        );
    }

    async generateRefreshToken(
        context: LoginContext,
        policy: SessionPolicyInterface,
    ): Promise<string> {

        return this.jwtService.signAsync(
            {
                sub: context.user.id,
            },
            {
                expiresIn: policy.refreshTokenExpiresIn,
            },
        );
    }
}
