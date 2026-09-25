import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { ConnectionDto } from './dto/connection-dto';

@WebSocketGateway({
    cors: true,
})
export class DeviceGateway {

    @WebSocketServer()
    server!: Server;

    handleConnection(socket: Socket): void {
        const deviceId = socket.handshake.query.deviceId as string;

        console.log('Device connected:', deviceId);

        if (deviceId) {
            socket.join(deviceId);
        }

        console.log('Joined room:', deviceId);
    }

    sendToAdmin(
        adminDeviceId: string,
        device: ConnectionDto,
    ): Promise<boolean> {
        
        return new Promise((resolve) => {

            const room = this.server.sockets.adapter.rooms.get(adminDeviceId);

            console.log('ADMIN ROOM:', adminDeviceId);
            console.log('ROOM EXISTS:', !!room);
            console.log('SOCKETS IN ROOM:', room ? [...room] : []);

            this.server
            .to(adminDeviceId)
            .timeout(5000)
            .emit(
                'device-status',
                device,
                (err: Error | null) => {
                    resolve(!err);
                },
            );
        });
    }
}