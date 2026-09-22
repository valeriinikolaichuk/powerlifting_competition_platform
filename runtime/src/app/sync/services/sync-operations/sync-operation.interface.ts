import { SyncOutboxDto } from "../../../services/sync/dto/sync-outbox.dto";

export interface SyncOperationInterface {

    supports(operationId: string): boolean;

    execute(
        data: SyncOutboxDto, 
        tx: any
    ): Promise<void>;
}