import { Component, inject, Type } from '@angular/core';

import { PopupService } from '../../services/popup.service';
import { POPUP_DATA } from '../../tokens/popup-data.token';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';

import { ConnectionsPopupService } from './services/connections-popup.service';

import { ConnectionsService } from '../../../connections/services/connections.service';
import { ConnectionDto } from '../../../connections/dto/connection-dto';

@Component({
  selector: 'app-connections-popup',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './connections-popup.component.html',
})
export class ConnectionsPopupComponent {

  popup = inject(PopupService);

  data = inject(POPUP_DATA) as {
    content: Type<any>;
    connections: ConnectionDto[];
  };

  get connections(): ConnectionDto[] {
    return this.data.connections;
  }

  constructor(
    private readonly connectionsService: ConnectionsService,
    private readonly popupService: PopupService,
    public connectionsPopupService: ConnectionsPopupService,
    public tService: TranslationService,
  ) {
    this.tService.load('popups/delete-connections');

    for (const connection of this.connections) {
      connection.browser = this.connectionsPopupService.getBrowserName(
      connection.user_agent
    );
    }
  }    

  async delete(): Promise<void> {

    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[data-device-id]:checked'
    );

    const selectedDeviceIds = Array.from(checkboxes)
      .map(checkbox => checkbox.getAttribute('data-device-id'))
      .filter((id): id is string => id !== null);

    if (selectedDeviceIds.length === 0) {
      return;
    }

    const confirmed = confirm(
      this.tService.t('DELETE_WARNING', 'popups/delete-connections')
    );

    if (!confirmed) {
      return;
    }

    await this.connectionsService.deleteDevices(selectedDeviceIds);

    alert(
      this.tService.t('DELETED', 'popups/delete-connections')
    );

    this.popupService.close<string[]>(selectedDeviceIds);
  }

  close() {
    this.popup.close([]);
  }
}