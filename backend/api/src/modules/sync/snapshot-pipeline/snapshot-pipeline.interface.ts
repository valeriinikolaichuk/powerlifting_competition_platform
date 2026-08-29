import { SnapshotContext } from "../dto/snapshot-context.dto";

export interface SnapshotStepInterface {

    handle(context: SnapshotContext): Promise<void>;
}