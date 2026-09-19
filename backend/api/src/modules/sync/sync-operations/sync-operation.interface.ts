import { Prisma } from '@prisma/client';
import { SyncInboxItem } from "../dto/sync-inbox-item";

export interface SyncOperationInterface {

    supports(operationId: string): boolean;

    execute(
        data: SyncInboxItem,
        tx: Prisma.TransactionClient,
    ): Promise<void>;
}