import { Injectable } from '@nestjs/common';
import type { Response } from 'express';

import { LoginContext } from '../login-context';
import { SessionPolicyFactoryService } from '../policy/session-policy-factory.service';

@Injectable()
export class AuthenticationCookieService {

    constructor(
        private readonly policyFactory: SessionPolicyFactoryService,
    ) {}

    setLoginCookies(
        response: Response,
        context: LoginContext,
    ): void {

        if (!context.user) {
            return;
        }

        const policy = this.policyFactory.get(context.user.role);

        if (context.result.accessToken) {
            response.cookie('access_token', context.result.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: policy.cookieMaxAge,
            });
        }

        if (context.result.refreshToken) {
            response.cookie('refresh_token', context.result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: policy.cookieMaxAge,
            });
        }
    }

    clearCookies(response: Response): void {

        response.clearCookie('access_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        response.clearCookie('refresh_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
    }
}
