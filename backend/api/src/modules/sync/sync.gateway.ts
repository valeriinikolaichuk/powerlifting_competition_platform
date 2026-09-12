import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { SyncOutbox } from '@prisma/client';

import { SyncInboxService } from './sync-inbox.service';
import type { SyncQueueDto } from './dto/sync-queue.dto';

@WebSocketGateway()
export class SyncGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly syncInboxService: SyncInboxService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Socket connected: ${client.id}`);

    const deviceId = client.handshake.query.deviceId;

    if (typeof deviceId !== 'string') {
      client.disconnect();
      return;
    }

    client.join(deviceId);

    console.log(`Device ${deviceId} connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('sync')
  async handleSync(@MessageBody() data: SyncQueueDto) {
    
    await this.syncInboxService.receive(data);

    return { success: true, };
  }

  sendToDevice(
    deviceId: string,
    data: SyncOutbox,
  ): Promise<boolean> {

    return new Promise((resolve) => {

      this.server.to(deviceId).timeout(5000)
        .emit('sync', {
          id: data.id,
          operationId: data.operation_id,
          recordId: data.record_id,
          payload: data.payload,
        },
        (error: Error | null) => {

          if (error) {
            resolve(false);
            return;
          }

          resolve(true);
        },
      );
    });
  }
}