export interface SyncOutboxDto {
    
  id: string;
  operationId: string;
  recordId: string;
  payload: unknown;
}