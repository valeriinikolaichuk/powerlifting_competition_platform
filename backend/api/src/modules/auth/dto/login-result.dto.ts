export class LoginResultDto {

    success: boolean = false;

    message: string = '';

    accessToken?: string;

    refreshToken?: string;
}
