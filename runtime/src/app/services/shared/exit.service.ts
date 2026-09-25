import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { RuntimeSessionService } from '../../session/services/runtime-session.service';
import { ConnectionsService } from '../connections/services/connections.service';

import { PgliteService } from '../../database/services/pglite.service';
import { DeviceRoleService } from '../connections/services/device-role.service';

@Injectable({
  providedIn: 'root',
})
export class ExitService {

  constructor(
    private readonly runtimeSessionService: RuntimeSessionService,
    private readonly connectionsService: ConnectionsService,
    private http: HttpClient,
    private readonly router: Router,
    private readonly pgliteService: PgliteService,
    public deviceRoleService: DeviceRoleService,
  ) {}

  async backToMode(): Promise<void> {
  
    const dto = await this.connectionsService.exitParameters();

    let deviceId = dto.device_id;
    const mode = dto.mode;
    const lang = dto.language;

    if (deviceId) {
      const role = sessionStorage.getItem('device_role');
console.log(deviceId);
//      if (role === 'ADMIN') {
        await this.connectionsService.deleteDevices([deviceId]);
//      } else {
//        await this.connectionsService.softDeleteDevices([deviceId]);
//      }
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

  async backToRole(): Promise<void> {
   
    const result = await this.pgliteService.query<{ id: string }>(
      `
        SELECT id
        FROM device_status 
        LIMIT 1
      `
    );

    const id = result.rows[0].id;
    const now = new Date().toISOString();

    const success = await this.deviceRoleService.updateRole({
      id: id,
      clientRole: null,
      updated_at: now,
    });

    if (success) {
      sessionStorage.removeItem('device_role');

      await this.router.navigate(['/client'])
    }
  }
}
