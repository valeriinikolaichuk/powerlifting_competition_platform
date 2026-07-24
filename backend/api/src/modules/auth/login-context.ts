import { LoginDto } from "./dto/login.dto";
import { User } from '@prisma/client';
import { LoginResultDto } from "./dto/login-result.dto";

export class LoginContext {

    constructor(
        public readonly dto: LoginDto,
    ) {}

    method?: string;

    user!: User;

    result: LoginResultDto = new LoginResultDto();
}
