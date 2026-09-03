import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { RuntimeSessionService } from '../../session/services/runtime-session.service';
import { ConnectionsService } from '../../connections/services/connections.service';

@Injectable({
  providedIn: 'root',
})
export class ExitService {

  constructor(
    private readonly runtimeSessionService: RuntimeSessionService,
    private readonly connectionsService: ConnectionsService,
    private http: HttpClient,
  ) {}

  async backToMode(): Promise<void> {
  
    const dto = await this.connectionsService.exitParameters();

    let deviceId = dto.device_id;
    const mode = dto.mode;
    const lang = dto.language;

    if (deviceId) {
      await this.connectionsService.deleteDevices([deviceId]);
    }

    localStorage.removeItem('device_id');
    sessionStorage.removeItem('device_role');

    await this.runtimeSessionService.clearSession();
  
    if (mode === 'online') {
  
      window.location.href = `${environment.frontendUrl}/mode?lang=${lang}`;
  
      return;
    }

    await this.clearCookies()
  
    window.close();
  }

  async clearCookies() {
    return this.http.post(
      `${environment.apiUrl}/api/logout`,
      {},
      {
        withCredentials: true
      }
    );
  }
}
