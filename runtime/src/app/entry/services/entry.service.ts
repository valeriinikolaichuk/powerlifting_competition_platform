import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { DeviceParameters } from '../dto/device-parameters';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  
  constructor(
    private readonly http: HttpClient,
  ) {}

  async check(): Promise<void> {

    const params = new URLSearchParams(window.location.search);

    const language = params.get('lang') ?? '';
    const mode = params.get('mode') ?? '';

    let deviceId: string = crypto.randomUUID();

    if (mode === 'lan' && window.location.hostname === 'localhost') {
        deviceId = params.get('device_id') ?? '';
    }

    const dto: DeviceParameters = {
      device_id: deviceId,
      language: language,
      mode: mode
    };

    await firstValueFrom(
      this.http.post(
        '/api/connections/entry',
        dto,
      ),
    );
  }
}
