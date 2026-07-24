import { LoginContext } from "../login-context";

export interface MethodPipelineInterface {

    handle(context: LoginContext): Promise<void>;
}
