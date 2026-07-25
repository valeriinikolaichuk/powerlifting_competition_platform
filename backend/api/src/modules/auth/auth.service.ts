import { Injectable } from '@nestjs/common';

import { MethodPipelineService } from './method-pipeline/method-pipeline.service';
import { AuthFactoryService } from './authentication/auth-factory.service';
import { LoginDto } from './dto/login.dto';
import { LoginContext } from './login-context';

@Injectable()
export class AuthService {

    constructor(
        private readonly pipeline: MethodPipelineService,
        private readonly authFactory: AuthFactoryService
    ) {}

    async login(dto: LoginDto): Promise<LoginContext> {

        const context = new LoginContext(dto);

        await this.pipeline.execute(context);

        await this.authFactory.authenticate(context);

        return context;
    }
}
