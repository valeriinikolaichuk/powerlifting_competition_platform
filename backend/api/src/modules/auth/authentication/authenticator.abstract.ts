import { SessionPolicyFactoryService } from '../policy/session-policy-factory.service';
import { LoginContext } from "../login-context";
import { LoginResultDto } from "../dto/login-result.dto";
import { PrismaService } from '../../prisma/prisma.service';
import { TokenService } from '../token/token.service';

export abstract class AuthenticatorAbstract {

    constructor(
        protected readonly prisma: PrismaService,
        protected readonly tokenService: TokenService,
        protected readonly sessionPolicyFactory: SessionPolicyFactoryService,
    ) {}

    abstract supports(context: LoginContext): boolean;

    protected abstract authenticate(context: LoginContext): Promise<boolean>;

    async execute(context: LoginContext): Promise<LoginResultDto> {

        const success = await this.authenticate(context);

        if (!success) {
            return context.result;
        }

        await this.updateLastLogin(context);

        const policy = this.sessionPolicyFactory.get(context.user.role);

        context.result.accessToken = await this.tokenService.generateAccessToken(
            context,
            policy
        );

        if (policy.issueRefreshToken) {
            context.result.refreshToken = await this.tokenService.generateRefreshToken(
                context, 
                policy
            );
        }

        return context.result;
    }

    protected async updateLastLogin(context: LoginContext): Promise<void> {
        await this.prisma.user.update({
            where: {
                id: context.user.id,
            },
            data: {
                last_login: new Date(),
            },
        });
    }
}
