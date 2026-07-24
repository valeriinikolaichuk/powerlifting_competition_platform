import { MethodPipelineInterface } from "./method-pipeline.interface";
import { LoginContext } from "../login-context";

export class LoginMethodDefault  implements MethodPipelineInterface 
{
  async handle(context: LoginContext): Promise<void> {

    if (
      context.dto.login &&
      context.dto.password
    ) {
      context.method = 'default';
    }
  }
}
