import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ConnectionsService } from '../services/connections/services/connections.service';
import { DeviceParameters } from '../services/connections/dto/device-parameters';
import { ConnectionDto } from '../services/connections/dto/connection-dto';
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

      await this.synchronize();

      await this.router.navigate(['/admin']);

      return;
    }

    const dto = await this.connectionsService.createParameters();

    const adminExists = await this.check(dto);

    await this.router.navigate(
      adminExists ? ['/client'] : ['/admin']
    );
  }

  private async check(
    dto: DeviceParameters,
  ): Promise<boolean> {

    const result = await this.connectionsService.check(dto);

    if (result.adminExists === false) {
      sessionStorage.setItem('device_role', 'ADMIN');
    }

    if (result.connections.length === 0) {

      await this.synchronize();

      return result.adminExists;
    }

    const deletedDeviceIds = await this.openConnectionsPopup(result.connections);

    // user closed the popup
    if (deletedDeviceIds.length === 0) {

      await this.synchronize();

      return result.adminExists;
    }

    // showing connections after deletion
    return await this.check(dto);
  }

  private async synchronize(): Promise<void> {

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

    } catch (error) {

      this.popup.close();

      const retry = await this.popup.open<boolean>(
        RetryPopupComponent, 
        {   
          content: SynchronizationErrorComponent  
        }
      );

      if (retry) {
        await this.synchronize();
      }
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
