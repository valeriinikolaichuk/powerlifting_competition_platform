import { Injectable, Inject } from '@nestjs/common';
import { LOGIN_METHODS } from '../auth.tokens';
import { MethodPipelineInterface } from './method-pipeline.interface';
import { LoginContext } from '../login-context';

@Injectable()
export class MethodPipelineService {

  constructor(
    @Inject(LOGIN_METHODS)
        private readonly pipes: MethodPipelineInterface[],
    ) {}

  async execute(context: LoginContext) {

    for (const pipe of this.pipes) {
      await pipe.handle(context);
    }

    return context;
  }
}
