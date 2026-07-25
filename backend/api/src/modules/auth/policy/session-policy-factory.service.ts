import { Injectable, Inject, UnprocessableEntityException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { SessionPolicyInterface } from './session-policy.interface';
import { TOKEN_COOKIE_POLICY } from '../auth.tokens';

@Injectable()
export class SessionPolicyFactoryService {

    constructor(
        @Inject(TOKEN_COOKIE_POLICY)
        private readonly policies: SessionPolicyInterface[]
    ) {}

    get(role: UserRole): SessionPolicyInterface {

        const policy = this.policies.find(
            policy => policy.supports(role),
        );

        if (!policy) {
            throw new UnprocessableEntityException(`No session policy for role ${role}`);
        }

        return policy;
    }
}
