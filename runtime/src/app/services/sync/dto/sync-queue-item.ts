export interface SyncQueueItem {

    id: string;
    source_id: string;
    operation_id: string;
    record_id: string;
    payload: unknown | null;
    created_at: string;
    processed_at: string | null;
}
