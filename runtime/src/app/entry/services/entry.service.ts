import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { DeviceParameters } from '../dto/device-parameters';
import { ConnectionsResultDto } from '../dto/connections-result-dto';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  
  constructor(
    private readonly http: HttpClient,
  ) {}

  createParameters(): DeviceParameters {

    const params = new URLSearchParams(window.location.search);

    const language = params.get('lang') ?? '';
    const mode = params.get('mode') ?? '';

    let deviceId: string = crypto.randomUUID();

    if (mode === 'lan' && window.location.hostname === 'localhost') {
        deviceId = params.get('device_id') ?? '';
    }

    return {
      device_id: deviceId,
      language: language,
      mode: mode
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

  async deleteConnections(
    deviceIds: string[],
  ): Promise<void> {

    await firstValueFrom(
      this.http.post<void>(
        '/api/connections/delete',
        {
          device_ids: deviceIds,
        },
      ),
    );
  }
}
