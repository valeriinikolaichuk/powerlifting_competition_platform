import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PGlite } from '@electric-sql/pglite';

import { environment } from '../../../../environments/environment';
import { DeviceIdService } from '../../shared/device-id.service';
import { DeviceParameters } from '../dto/device-parameters';
import { LanTokenService } from '../../cookies/lan-token.service';
import { ConnectionsResultDto } from '../dto/connections-result-dto';
import { PgliteDeviceParameters } from '../dto/pglite-device-parameters';
import { PgliteService } from '../../../database/services/pglite.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionsService {

  private pg!: PGlite;
  
  constructor(
    private readonly deviceIdService: DeviceIdService,
    private readonly http: HttpClient,
    private readonly lanTokenService:LanTokenService,
    private readonly pgliteService: PgliteService,
  ) {}

  async initializePglite(): Promise<void> {
    this.pg = this.pgliteService.database;
  }

  async createParameters(): Promise<DeviceParameters> {

    const params = new URLSearchParams(window.location.search);
    const language = params.get('lang')?.toUpperCase() ?? '';

    const deviceParams = this.deviceIdService.getDeviceId();
    const mode = deviceParams.mode.toUpperCase() ?? '';
    const deviceId = deviceParams.deviceId;

    if (mode === 'LAN') {
      await firstValueFrom(
        this.lanTokenService.ensureToken()
      );
    }

    return {
      device_id: deviceId,
      language: language,
      mode: mode,
      user_agent: navigator.userAgent,
    };
  }

  async check(
    dto: DeviceParameters,
  ): Promise<ConnectionsResultDto> {

    return await firstValueFrom(
      this.http.post<ConnectionsResultDto>(
        '/api/connections/entry',
        dto,
      ),
    );
  }

  async exitParameters(): Promise<DeviceParameters> {

    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang') ?? '';

    const deviceParams = this.deviceIdService.getDeviceId();
    const mode = deviceParams.mode.toUpperCase() ?? '';
    const deviceId = deviceParams.deviceId;

    if (lang !== '' && mode !== '') {
   
      return {
        device_id: deviceId!,
        language: lang,
        mode: mode,
        user_agent: null,
      };
    }

    await this.initializePglite();

    const result = await this.pg.query<PgliteDeviceParameters>(
      `
        SELECT
            language,
            mode
        FROM device_status
        WHERE 
          device_id = $1
          AND is_deleted = false
      `, [deviceId]
    );

    const device = result.rows[0];

    if (!device) {
      throw new Error('Active device session not found.');
    }

    return {
        device_id: deviceId!,
        language: device.language.toLowerCase(),
        mode: device.mode.toLowerCase(),
        user_agent: null,
    };
  }

  async deleteDevices(
    deviceIds: string[],
  ): Promise<void> {
    await firstValueFrom(
      this.http.delete(
        `${environment.apiUrl}/api/connections/exit`,
        {
          body: {
            device_ids: deviceIds,
          },
          withCredentials: true,
        },
      ),
    );
  }

  async softDeleteDevices(
    deviceIds: string[],
  ): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/api/connections/exit-client`,
        {
          body: {
            device_ids: deviceIds,
          },
          withCredentials: true,
        },
      ),
    );
  }
}
