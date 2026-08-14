import { Component, inject } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

import { POPUP_DATA } from '../../../tokens/popup-data.token';
import { ConnectionDto } from '../../../../connections/dto/connection-dto';
import { ConnectionsService } from '../../../../connections/services/connections.service';

import { PopupService } from '../../../services/popup.service';
import { ConnectionsPopupService } from '../services/connections-popup.service';

@Component({
  selector: 'app-delete-connections',
  imports: [TranslatePipe],
  templateUrl: './delete-connections.component.html',
})
export class DeleteConnectionsComponent {

  data = inject(POPUP_DATA) as {
    connections: ConnectionDto[];
  };

  get connections(): ConnectionDto[] {
    return this.data.connections;
  }

  selectedDeviceIds: string[] = [];


  constructor(
    public connectionsPopupService: ConnectionsPopupService,
    private readonly connectionsService: ConnectionsService,
    public tService: TranslationService, 
    private readonly popup: PopupService,   
  ) {
    this.tService.load('popups/delete-connections');

    for (const connection of this.connections) {
      if (connection.user_agent) {
        connection.user_agent = this.connectionsPopupService.getBrowserName(
          connection.user_agent
        );
      }
    }
  }



  isSelected(deviceId: string): boolean {
    return this.selectedDeviceIds.includes(deviceId);
  }

  toggleSelection(deviceId: string): void {

    const index = this.selectedDeviceIds.indexOf(deviceId);

    if (index === -1) {
      this.selectedDeviceIds.push(deviceId);
    } else {
      this.selectedDeviceIds.splice(index, 1);
    }
  }

  async delete(): Promise<void> {

    if (this.selectedDeviceIds.length === 0) {
      return;
    }

    const confirmed = confirm(
      this.tService.t('DELETE_WARNING', 'popups/delete-connections')
    );

    if (!confirmed) {
      return;
    }

    await this.connectionsService.deleteDevices(this.selectedDeviceIds);

    alert(
      this.tService.t('DELETED', 'popups/delete-connections')
    );

    this.popup.close<string[]>(this.selectedDeviceIds);
  }
}
