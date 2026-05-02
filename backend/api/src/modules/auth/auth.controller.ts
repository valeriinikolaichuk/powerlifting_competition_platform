import { Controller, Post, Body } from '@nestjs/common';

@Controller('api/auth')
export class AuthController {

    @Post('login')
    login(@Body() body: any) {
        console.log('LOGIN DATA:', body);

        return {
            success: true,
            user: {
                login: body.login
            }
        };
    }
}
