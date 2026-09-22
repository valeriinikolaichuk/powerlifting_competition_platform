import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { ConnectionDto } from './dto/connection-dto';

@WebSocketGateway({
    cors: true,
})
export class DeviceGateway {

    @WebSocketServer()
    server!: Server;

    sendToAdmin(
        adminDeviceId: string,
        device: ConnectionDto,
    ): Promise<boolean> {
        return new Promise((resolve) => {
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