import { JwtService } from '@nestjs/jwt';
import { LoginContext } from "../login-context";
import { LoginResultDto } from "../dto/login-result.dto";

export abstract class AuthenticatorAbstract {

    constructor(
        protected readonly jwtService: JwtService,
    ) {}

    abstract supports(context: LoginContext): boolean;

    protected abstract authenticate(context: LoginContext): Promise<boolean>;

    async execute(context: LoginContext): Promise<LoginResultDto> {

        const success = await this.authenticate(context);

        if (!success) {
            return context.result;
        }

        context.result.token = await this.generateToken(context);

        return context.result;
    }

    protected async generateToken(context: LoginContext): Promise<string>
    {
        return this.jwtService.signAsync(
            {
                sub: context.user.id,
                role: context.user.role,
            },
            {
                expiresIn: '7d',
            },
        );
    }
}
