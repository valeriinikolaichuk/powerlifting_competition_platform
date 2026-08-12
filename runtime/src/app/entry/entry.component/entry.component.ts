import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConnectionsService } from '../../connections/services/connections.service';
import { DeviceParameters } from '../../connections/dto/device-parameters';
import { ConnectionDto } from '../../connections/dto/connection-dto';

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

    const deletedDeviceIds = await this.openConnectionsPopup(result.connections,);

    /*
     * Користувач просто закрив popup.
     */
    if (deletedDeviceIds.length === 0) {

      await this.navigate();

      return;
    }

    await this.connectionsService.deleteConnections(deletedDeviceIds,);

    await this.showDeletedMessage();

    /*
     * OK → використовуємо ТОЙ САМИЙ dto.
     */
    await this.check(dto);
  }

  private async navigate(): Promise<void> {

    const params = new URLSearchParams(window.location.search);

    if (this.adminExists === false) {

      await this.router.navigate(['/admin'],);

      return;
    }

    await this.router.navigate(['/role'],);
  }

  private async openConnectionsPopup(
    connections: ConnectionDto[],
  ): Promise<string[]> {

    // PopupService
    return [];
  }

  private async showDeletedMessage(): Promise<void> {

    // PopupService
  }
}
