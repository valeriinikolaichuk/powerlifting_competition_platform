import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";

export class UserStep implements SnapshotStepInterface {

    async handle(context: SnapshotContext): Promise<void> {

        context.data['users'] = [{ id: context.userId }];
    }
}
