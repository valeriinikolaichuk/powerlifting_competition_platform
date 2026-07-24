import { Controller, Post, Get, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from './guards/current-user.decorator';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const result = await this.authService.login(dto);

        if (result.token) {
            response.cookie('access_token', result.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
        }

        return {
            success: result.success,
            message: result.message,
        };
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user: any) { 
        return {
            success: true,
            data: user, // return { id: '...', role: '...' }
        };
    }

    @Post('logout')
    async clearCookie(@Res({ passthrough: true }) response: Response) {
        response.cookie('access_token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 0, 
        });

        return {
            success: true,
            message: 'Logged out successfully',
        };
    }
}
