import { Injectable, Inject, UnprocessableEntityException } from '@nestjs/common';

import { LoginContext } from '../login-context';
import { LoginResultDto } from '../dto/login-result.dto';

import { AuthenticatorAbstract } from './authenticator.abstract';
import { LOGIN_STRATEGIES } from '../auth.tokens';

@Injectable()
export class AuthFactoryService {

    constructor(
        @Inject(LOGIN_STRATEGIES)
        private readonly authenticators: AuthenticatorAbstract[]
    ) {}

    async authenticate(context: LoginContext,): Promise<LoginResultDto> 
    {
        for (const authenticator of this.authenticators) {

            if (authenticator.supports(context)) {
                return authenticator.execute(context);
            }
        }

        throw new UnprocessableEntityException('No authenticator supports given login method');
    }
}
