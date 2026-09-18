import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ConnectionsService } from '../connections/services/connections.service';
import { DeviceParameters } from '../connections/dto/device-parameters';
import { ConnectionDto } from '../connections/dto/connection-dto';
import { PopupService } from '../popup/services/popup.service';
import { ConnectionsPopupComponent } from '../popup/components/connections-popup/connections-popup.component';

import { SyncService } from '../sync/services/sync.service';
import { SystemPopupComponent } from '../popup/components/system-popups/system-popup.component';
import { SynchronizingDatabaseComponent } from '../popup/components/system-popups/synchronizing-database/synchronizing-database.component';
import { RetryPopupComponent } from '../popup/components/retry-popup/retry-popup.component';
import { SynchronizationErrorComponent } from '../popup/components/retry-popup/synchronization-error/synchronization-error.component';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  
  constructor(
    private readonly router: Router,
    private readonly connectionsService: ConnectionsService,
    public popup: PopupService,
    private readonly syncService: SyncService,
  ) {}

  async entry(): Promise<void> {

    const role = sessionStorage.getItem('device_role');

    if (role === 'ADMIN') {

      const success = await this.synchronize();

      if (success) {
        await this.router.navigate(['/admin']);
      }

      return;
    }

    const dto = await this.connectionsService.createParameters();

    await this.check(dto);
  }

  private async check(
    dto: DeviceParameters,
  ): Promise<void> {

    const result = await this.connectionsService.check(dto);

    if (result.adminExists === false) {
      sessionStorage.setItem('device_role', 'ADMIN');
    }

    if (result.connections.length === 0) {

      const success = await this.synchronize();

      if (success) {
        await this.router.navigate(
          result.adminExists ? ['/client'] : ['/admin']
        );
      }

      return;
    }

    const deletedDeviceIds = await this.openConnectionsPopup(result.connections);

    // user closed the popup
    if (deletedDeviceIds.length === 0) {

      const success = await this.synchronize();

      if (!success) { return; }

      return;
    }

    // showing connections after deletion
    await this.check(dto);
  }

  private async synchronize(): Promise<boolean> {

    this.popup.open(
      SystemPopupComponent, 
      {
        content: SynchronizingDatabaseComponent
      }
    );
    
    // pgLite synchronization
    try {

      await this.syncService.initialize();

      this.popup.close();

      return true;

    } catch (error) {

      this.popup.close();

      const retry = await this.popup.open<boolean>(
        RetryPopupComponent, 
        {   
          content: SynchronizationErrorComponent  
        }
      );

      if (retry) {
        return await this.synchronize();
      }

      return false;
    }
  }

  private async openConnectionsPopup(
    connections: ConnectionDto[],
  ): Promise<string[]> {

    return this.popup.open<string[]>(
      ConnectionsPopupComponent,
      {
        connections,
      },
    );
  }
}
