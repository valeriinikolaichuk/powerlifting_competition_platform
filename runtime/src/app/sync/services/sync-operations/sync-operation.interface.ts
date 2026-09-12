import { SyncOutboxDto } from "../../dto/sync-outbox.dto";

export interface SyncOperationInterface {

    supports(operationId: string): boolean;

    execute(data: SyncOutboxDto): Promise<void>;
}