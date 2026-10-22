import { Injectable } from '@angular/core';
import { DeviceParamsDto } from './dto/device-params.dto';

@Injectable({
  providedIn: 'root',
})
export class DeviceIdService {

  getDeviceId(): DeviceParamsDto {

    const params = new URLSearchParams(window.location.search);

    let deviceId = localStorage.getItem('device_id');
    const mode = params.get('mode') ?? '';

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('device_id', deviceId);
    }

    if (mode === 'lan' && window.location.hostname === 'localhost') {
      deviceId = params.get('device_id') ?? '';
      localStorage.setItem('device_id', deviceId);
    }

    return {
        deviceId: deviceId,
        mode: mode
    };
  }
}
