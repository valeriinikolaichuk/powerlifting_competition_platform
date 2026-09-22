import { Injectable } from '@angular/core';

import { SocketService } from '../../sync/services/socket.service';
import { PgliteService } from '../../database/services/pglite.service';
import { ConnectionDto } from '../dto/connection-dto';

@Injectable({
  providedIn: 'root',
})
export class DeviceReceiverService {
  
  constructor(
    private readonly socketService: SocketService,
    private readonly pgliteService: PgliteService,
  ) {
    this.listen();
  }

  private listen(): void {
    this.socketService.socket.on(
      'device-status',
      async (
        device: ConnectionDto,
        callback: () => void,
      ) => {
        try {
          if (device.is_deleted) {
            await this.pgliteService.query(
              `
                DELETE FROM device_status
                WHERE id = $1
              `,
              [device.id],
            );

            callback();
            return;
          }

          await this.pgliteService.query(
            `
              INSERT INTO device_status (
                id,
                created_by_user_id,
                device_id,
                mode,
                language,
                device_role,
                ip_address,
                user_agent,
                created_at,
                updated_at,
                sent_at,
                is_deleted
              )
              VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12
              )
              ON CONFLICT (id)
              DO UPDATE SET
                created_by_user_id = EXCLUDED.created_by_user_id,
                device_id = EXCLUDED.device_id,
                mode = EXCLUDED.mode,
                language = EXCLUDED.language,
                device_role = EXCLUDED.device_role,
                ip_address = EXCLUDED.ip_address,
                user_agent = EXCLUDED.user_agent,
                created_at = EXCLUDED.created_at,
                updated_at = EXCLUDED.updated_at,
                sent_at = EXCLUDED.sent_at,
                is_deleted = EXCLUDED.is_deleted
            `,
            [
              device.id,
              device.created_by_user_id,
              device.device_id,
              device.mode,
              device.language,
              device.device_role,
              device.ip_address ?? null,
              device.user_agent ?? null,
              device.created_at,
              device.updated_at,
              device.sent_at ?? null,
              device.is_deleted,
            ],
          );

          callback();
        } catch (error) {
          console.error('Failed to update device status:', error);
        }
      },
    );
  }
}
