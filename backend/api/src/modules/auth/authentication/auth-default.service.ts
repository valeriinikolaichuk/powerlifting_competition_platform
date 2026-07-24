import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

import { AuthenticatorAbstract } from './authenticator.abstract';
import { LoginContext } from '../login-context';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AuthDefaultService extends AuthenticatorAbstract {

    constructor(
        private readonly prisma: PrismaService,
        jwtService: JwtService,
    ) {
        super(jwtService);
    }

    supports(context: LoginContext): boolean 
    {
        return context.method === 'default';
    }

    protected async authenticate(context: LoginContext): Promise<boolean> 
    {
        const user =
            await this.prisma.user.findUnique({
                where: {
                    username: context.dto.login,
                },
            });

        if (!user) {
            context.result.message ='Invalid credentials';

            return false;
        }

        if (user.status !== UserStatus.ACTIVE) {
            context.result.message = 'User account is not active';
            return false;
        }

        const valid = await bcrypt.compare(
            context.dto.password,
            user.password,
        );

        if (!valid) {
            context.result.message = 'Invalid credentials';
            return false;
        }

        context.user = user;
        context.result.success = true;

        return true;
    }
}
