import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import { PgliteService } from '../../database/services/pglite.service';
import { SocketService } from './socket.service';
import { SyncOperationFactory } from './sync-operations/sync-operation-factory';

@Injectable({
  providedIn: 'root',
})
export class SyncReceiverService {

  private pg!: PGlite;

  constructor(
    private readonly pgliteService: PgliteService,
    private readonly socketService: SocketService,
    private readonly syncOperationFactory: SyncOperationFactory, 
  ) {
    this.listen();
  }

  private listen(): void {

    this.socketService.socket.on('sync', async (data, callback) => {

      try {

        const existing = await this.pgliteService.query(
          `
            SELECT 1
            FROM sync_processed
            WHERE sync_id = $1::uuid
          `,
          [data.sync_id],
        );

        if (existing.rows.length > 0) {
            if (data.processed_at !== null) {

                await this.pgliteService.query(
                `
                  DELETE FROM sync_processed
                  WHERE processed_at IS NOT NULL
                    AND sync_id = $1::uuid
                `,
                  [data.sync_id],
                );
            } 

          callback({ success: true });
          return;
        }

        this.pg = this.pgliteService.database;

        await this.pg.transaction(async (tx) => {

          const operation = this.syncOperationFactory.create(data.operationId);

          await operation.execute(data, tx);

          await tx.query(
            `
              INSERT INTO sync_processed (sync_id)
              VALUES ($1)
            `,
            [data.sync_id],
          );
        });

        callback({success: true,});

      } catch (error) {

        console.error('Sync failed:', error);

        callback({success: false,});
      }

    });
  }
}
