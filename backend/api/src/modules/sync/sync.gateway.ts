import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('sync')
  async handleSync(@MessageBody() data: SyncQueueDto) {
    
    await this.syncInboxService.receive(data);

    return {
      success: true,
    };
  }
}