import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';

import type { DeviceRole } from '#shared-sql';
import { SYNC_OPERATIONS } from '#shared-sql';

import { PgliteService } from '../../../database/services/pglite.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceRoleService {

  constructor(
    private readonly pgliteService: PgliteService,
    private http: HttpClient,
  ) {}
    
  async updateRole(data: DeviceRole): Promise<boolean> {

    const deviceId = localStorage.getItem('device_id');

    if (!deviceId) {
      throw new Error('Device ID not found.');
    }

    const id = crypto.randomUUID();

    try {
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/api/sync/device-role`,
          {
            id,
            source_id: deviceId,
            operation_id: 'UPDATE_DEVICE_ROLE',
            record_id: data.id,
            payload: data,
          },
        ),
      );

      const pg = this.pgliteService.database;

      await pg.query(
        SYNC_OPERATIONS.UPDATE_DEVICE_ROLE,
        [
          data.id,
          data.clientRole,
          data.updated_at,
        ],
      );

      return true;
    } catch (error) {
      console.error('Failed to update device role:', error);
      return false;
    }
  }
}
