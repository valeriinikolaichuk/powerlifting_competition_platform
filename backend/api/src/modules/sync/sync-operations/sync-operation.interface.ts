import { SyncInboxItem } from "../dto/sync-inbox-item";

export interface SyncOperationInterface {

    supports(operationId: string): boolean;

    execute(data: SyncInboxItem): Promise<void>;
}