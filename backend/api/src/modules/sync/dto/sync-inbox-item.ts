export interface SyncInboxItem {
    
  id: string;
  sourceId: string;
  operationId: string;
  recordId: string;
  payload: unknown;
}