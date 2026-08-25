CREATE TABLE sync_queue (
    id UUID PRIMARY KEY,
    source_id UUID NOT NULL,
    operation_id TEXT NOT NULL,
    record_id UUID NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL
);