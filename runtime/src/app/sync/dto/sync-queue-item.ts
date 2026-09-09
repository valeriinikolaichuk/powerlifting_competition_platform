export interface SyncQueueItem {

    id: string;
    source_id: string;
    operation_id: string;
    record_id: string;
    payload: string;
    created_at: string;
}
