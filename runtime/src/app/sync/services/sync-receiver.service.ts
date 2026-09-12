import { Injectable } from '@angular/core';

import { SocketService } from './socket.service';
import { SyncOperationFactory } from './sync-operations/sync-operation-factory';

@Injectable({
  providedIn: 'root',
})
export class SyncReceiverService {

  constructor(
    private readonly socketService: SocketService,
    private readonly syncOperationFactory: SyncOperationFactory, 
  ) {
    this.listen();
  }

  private listen(): void {

    this.socketService.socket.on('sync', async (data, callback) => {

      try {

        const operation = this.syncOperationFactory.create(data.operationId);

        await operation.execute(data);

        callback( {success: true,} );

      } catch (error) {

        console.error('Sync failed:', error);

        callback( {success: false,} );
      }

    });
  }
}
