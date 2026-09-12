import { Injectable } from '@angular/core';

import { PgliteService } from '../../database/services/pglite.service';
import { SocketService } from './socket.service';
import { SyncQueueItem } from '../dto/sync-queue-item';

@Injectable({
  providedIn: 'root',
})
export class SyncQueueService {
   
  constructor(
    private readonly pgliteService: PgliteService,
    private readonly socketService: SocketService,
  ) {}

  async addQueue(
    tx: any,
    sourceId: string,
    operationId: string,
    recordId: string,
    payload: unknown,
    createdAt: string,
  ): Promise<void> {
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
        JSON.stringify(payload),
        createdAt,
      ],
    );
  }

  async sync(): Promise<void> {

    await this.socketService.waitForConnection();

    const result = await this.pgliteService.query<SyncQueueItem>(
      `
      SELECT
        id,
        source_id,
        operation_id,
        record_id,
        payload,
        created_at
      FROM sync_queue
      WHERE processed_at IS NULL
      ORDER BY created_at ASC
      `,
    );

    for (const item of result.rows) {

      const payload = JSON.parse(item.payload);
      console.log(payload);
    }

    for (const item of result.rows) {

      try {
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
          sourceId: item.source_id,
          operationId: item.operation_id,
          recordId: item.record_id,
          payload: JSON.parse(item.payload),
          createdAt: item.created_at,
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
        SET processed_at = NOW()
        WHERE id = $1
      `,
      [id],
    );
  }
}
