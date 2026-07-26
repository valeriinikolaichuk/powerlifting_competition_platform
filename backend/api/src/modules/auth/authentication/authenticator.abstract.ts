import { JwtService } from '@nestjs/jwt';
import { SessionPolicyFactoryService } from '../policy/session-policy-factory.service';
import { LoginContext } from "../login-context";
import { LoginResultDto } from "../dto/login-result.dto";
import { SessionPolicyInterface } from '../policy/session-policy.interface';

export abstract class AuthenticatorAbstract {

    constructor(
        protected readonly jwtService: JwtService,
        protected readonly sessionPolicyFactory: SessionPolicyFactoryService,
    ) {}

    abstract supports(context: LoginContext): boolean;

    protected abstract authenticate(context: LoginContext): Promise<boolean>;

    async execute(context: LoginContext): Promise<LoginResultDto> {

        const success = await this.authenticate(context);

        if (!success) {
            return context.result;
        }

        const policy = this.sessionPolicyFactory.get(context.user.role);

        context.result.accessToken = await this.generateAccessToken(
            context,
            policy
        );

        if (policy.issueRefreshToken) {
            context.result.refreshToken = await this.generateRefreshToken(
                context, 
                policy
            );
        }

        return context.result;
    }

    protected async generateAccessToken(
        context: LoginContext, 
        policy: SessionPolicyInterface
    ): Promise<string>{

        return this.jwtService.signAsync(
            {
                sub: context.user.id,
            },
            {
                expiresIn: policy.accessTokenExpiresIn,
            },
        );
    }

    protected async generateRefreshToken(
        context: LoginContext,
        policy: SessionPolicyInterface,
    ): Promise<string> {

        return this.jwtService.signAsync(
            {
                sub: context.user.id,
            },
            {
                expiresIn: policy.refreshTokenExpiresIn,
            },
        );
    }
}
