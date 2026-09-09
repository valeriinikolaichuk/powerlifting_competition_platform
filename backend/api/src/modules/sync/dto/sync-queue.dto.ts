import type { Prisma } from '@prisma/client';

export interface SyncQueueDto {

    id: string;
    source_id: string;
    operation_id: string;
    record_id: string;
    payload: Prisma.InputJsonValue;
    created_at: string;
}