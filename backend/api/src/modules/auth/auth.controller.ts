import { Controller, Post, Get, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from './guards/current-user.decorator';

import { AuthService } from './auth.service';
import { AuthenticationCookieService } from './cookies/authentication-cookie.service';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
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
            data: user,
        };
    }

    @Post('logout')
    async clearCookie(@Res({ passthrough: true }) response: Response) {

        this.cookieService.clearCookies(response);

        return {success: true};
    }
}
