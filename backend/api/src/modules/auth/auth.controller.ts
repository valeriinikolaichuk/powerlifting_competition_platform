import { Controller, Post, Get, Body, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../guards/current-user.decorator';

import { AuthService } from './auth.service';
import { LanService } from './lan.service';
import { AuthenticationCookieService } from './cookies/authentication-cookie.service';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('api')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly lanService: LanService,
        private readonly cookieService: AuthenticationCookieService,
    ) {}

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const context = await this.authService.login(dto);

        if (context.result.accessToken) {
            this.cookieService.setLoginCookies(
                response,
                context,
            );
        }

        return {
            success: context.result.success,
            message: context.result.message,
            role: context.result.role,
        };
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user: any) { 
        return {
            success: true,
            user_id: user.sub,
        };
    }

    @Post('logout')
    async clearCookie(@Res({ passthrough: true }) response: Response) {

        this.cookieService.clearCookies(response);

        return {success: true};
    }

    @Post('lan-token')
    async createLanToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    ) {
        const context = await this.lanService.ensureToken(request);

        if (context.result.accessToken) {
            this.cookieService.setLoginCookies(
                response,
                context,
            );
        }

        return { success: true };
    }
}
