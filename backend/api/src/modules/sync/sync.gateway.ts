import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SyncGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket disconnected: ${client.id}`);
  }
}