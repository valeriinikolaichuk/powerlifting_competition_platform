import { Component, OnInit, Type } from '@angular/core';

import { ConnectionsService } from '../../connections/services/connections.service';
import { DeviceParameters } from '../../connections/dto/device-parameters';
import { ConnectionDto } from '../../connections/dto/connection-dto';

import { PopupService } from '../../popup/services/popup.service';
import { ConnectionsPopupComponent } from '../../popup/components/connections-popup/connections-popup.component';

import { SyncService } from '../../sync/services/sync.service';
import { SystemPopupComponent } from '../../popup/components/system-popups/system-popup.component';
import { SynchronizingDatabaseComponent } from '../../popup/components/system-popups/synchronizing-database/synchronizing-database.component';
import { DecisionPopupComponent } from '../../popup/components/decision-popup/decision-popup.component';
import { SynchronizationErrorComponent } from '../../popup/components/decision-popup/synchronization-error/synchronization-error.component';

import { RoleComponent } from '../../pages/role/role.component';
import { AdminComponent } from '../../pages/admin/admin.component';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [
    RoleComponent,
    AdminComponent
  ],
  templateUrl: './entry.component.html',
})
export class EntryComponent implements OnInit {

  adminExists: boolean | null = null;

  constructor(
    private readonly connectionsService: ConnectionsService,
    public popup: PopupService,
    private readonly syncService: SyncService,
  ) {}

  async ngOnInit(): Promise<void> {

    const role = sessionStorage.getItem('device_role');

    if (role === 'ADMIN') {
      
      this.adminExists = false;

      await this.synchronize();

      return;
    }

    const dto = await this.connectionsService.createParameters();

    await this.check(dto);
  }

  private async check(
    dto: DeviceParameters,
  ): Promise<void> {

    const result = await this.connectionsService.check(dto);

    this.adminExists = result.adminExists;

    if (result.adminExists === false) {
      sessionStorage.setItem('device_role', 'ADMIN');
    }

    if (result.connections.length === 0) {

      await this.synchronize();

      return;
    }

    const deletedDeviceIds = await this.openConnectionsPopup(result.connections);

    // user closed the popup.
    if (deletedDeviceIds.length === 0) {

      await this.synchronize();

      return;
    }

    // showing connections after deletion
    await this.check(dto);
  }

  private async synchronize(): Promise<void> {

    this.popup.open(SystemPopupComponent, {
      content: SynchronizingDatabaseComponent
    });
    
    // pgLite synchronization
    try {

      await this.syncService.initialize();

      this.popup.close();

    } catch (error) {

      this.popup.close();

      const retry = await this.popup.open<boolean>(
        DecisionPopupComponent, 
        {   
          content: SynchronizationErrorComponent  
        }
      );

      if (retry) {
        await this.synchronize();
        return;
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
