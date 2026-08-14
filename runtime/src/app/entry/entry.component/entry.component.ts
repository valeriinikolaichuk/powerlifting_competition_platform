import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';

import { ConnectionsService } from '../../connections/services/connections.service';
import { DeviceParameters } from '../../connections/dto/device-parameters';
import { ConnectionDto } from '../../connections/dto/connection-dto';

import { PopupService } from '../../popup/services/popup.service';
import { ConnectionsPopupComponent } from '../../popup/components/connections-popup/connections-popup.component';
import { DeleteConnectionsComponent } from '../../popup/components/connections-popup/delete-connections/delete-connections.component';

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

  adminExists = false;

  constructor(
    private readonly connectionsService: ConnectionsService,
    public popup: PopupService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {

    const dto = this.connectionsService.createParameters();

    await this.check(dto);
  }

  private async check(
    dto: DeviceParameters,
  ): Promise<void> {

    const result = await this.connectionsService.check(dto);

    this.adminExists = result.adminExists;

    if (result.connections.length === 0) {

      await this.navigate();

      return;
    }

    const deletedDeviceIds = await this.openConnectionsPopup(result.connections);

    // user closed the popup.
    if (deletedDeviceIds.length === 0) {

      await this.navigate();

      return;
    }

    // showing connections after deletion
    await this.check(dto);
  }

  private async navigate(): Promise<void> {

    if (this.adminExists === false) {

      await this.router.navigate(['/admin'],);

      return;
    }

    await this.router.navigate(['/role'],);
  }

  private async openConnectionsPopup(
    connections: ConnectionDto[],
  ): Promise<string[]> {

    return this.popup.open<string[]>(
      ConnectionsPopupComponent,
      {
        content: DeleteConnectionsComponent,
        connections,
      },
    );
  }
}
