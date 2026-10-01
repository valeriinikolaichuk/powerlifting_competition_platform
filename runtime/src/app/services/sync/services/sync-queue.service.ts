import { Injectable } from '@angular/core';

import { PgliteService } from '../../../database/services/pglite.service';
import { SocketService } from './socket.service';
import { SyncQueueItem } from '../dto/sync-queue-item';

@Injectable({
  providedIn: 'root',
})
export class SyncQueueService {
   
  private started = false;
  private syncPromise: Promise<void> | null = null;

  constructor(
    private readonly pgliteService: PgliteService,
    private readonly socketService: SocketService,
  ) {}

  start(): void {

    if (this.started) { return; }

    this.started = true;

    setInterval(() => { this.sync(); }, 1000);
  }

  async addQueue(
    tx: any,
    sourceId: string,
    operationId: string,
    recordId: string,
    payload: unknown,
    createdAt: string,
  ): Promise<void> {

    console.log('payload: '+payload);

    await tx.query(
      `
        INSERT INTO sync_queue (
          id,
          source_id,
          operation_id,
          record_id,
          payload,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        crypto.randomUUID(),
        sourceId,
        operationId,
        recordId,
        payload,
        createdAt,
      ],
    );
  }

  async sync(): Promise<void> {

    if (this.syncPromise) { return this.syncPromise }

    this.syncPromise = this.processQueue();

    try {
      await this.syncPromise;
    } finally {
      this.syncPromise = null;
    }
  }

  private async processQueue(): Promise<void> {

    if (!this.pgliteService.isInitialized()) { return; }

    await this.socketService.waitForConnection();

    console.log('Queue synchronization started...');

    const result = await this.pgliteService.query<SyncQueueItem>(
      `
      SELECT
        id,
        source_id,
        operation_id,
        record_id,
        payload,
        created_at, 
        processed_at
      FROM sync_queue
      ORDER BY created_at ASC
      `,
    );

    for (const item of result.rows) {

      try {
        console.log('SyncQueueItem: '+item.payload);
        await this.send(item);
      } catch (error) {
        console.error('Sync failed:', error);
        break;
      }
    }
  }

  async send(item: SyncQueueItem): Promise<void> {

    await new Promise<void>((resolve, reject) => {

      this.socketService.socket.emit(
        'sync',
        {
          id: item.id,
          source_id: item.source_id,
          operation_id: item.operation_id,
          record_id: item.record_id,
          payload: item.payload,
          created_at: item.created_at, 
          processed_at: item.processed_at,
        },
        (response: { success: boolean }) => {

          if (response.success) {
            resolve();
          } else {
            reject();
          }
        },
      );

    });

    await this.markAsProcessed(item.id);
  }

  private async markAsProcessed(id: string): Promise<void> {

    await this.pgliteService.query(
      `
        UPDATE sync_queue
        SET processed_at = NOW(),
            payload = NULL
        WHERE id = $1
      `,
      [id],
    );

    await this.pgliteService.query(
      `
        DELETE FROM sync_queue
        WHERE processed_at IS NOT NULL
          AND id <> $1
      `,
      [id],
    );
  }
}
