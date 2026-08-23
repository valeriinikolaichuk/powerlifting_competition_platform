import { Injectable, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';

import { LoginDto } from './dto/login.dto';
import { LoginContext } from './login-context';

import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from './token/token.service';
import { SessionPolicyFactoryService } from './policy/session-policy-factory.service';

@Injectable()
export class LanService {

    constructor(
        private readonly prisma: PrismaService,
        protected readonly tokenService: TokenService,
        protected readonly sessionPolicyFactory: SessionPolicyFactoryService,
    ) {}

    async ensureToken(
        request: Request,
    ): Promise<LoginContext> {

        const context = new LoginContext(new LoginDto);

        const accessToken = request.cookies?.access_token;

        if (accessToken) { 
            return context; 
        }

        const user = await this.prisma.user.findFirst({
            where: {
                role: 'USER',
            }
        });

        if (!user) {
            throw new NotFoundException('LAN USER was not found');
        }        

        context.user = user;
        context.result.role = context.user.role;
        context.result.success = true;

        const policy = this.sessionPolicyFactory.get(context.user.role);

        context.result.accessToken = await this.tokenService.generateAccessToken(
            context,
            policy
        );
        
        return context;
    }
}
