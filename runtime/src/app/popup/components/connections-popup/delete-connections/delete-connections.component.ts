import { Component, inject } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';

import { POPUP_DATA } from '../../../tokens/popup-data.token';
import { ConnectionDto } from '../../../../connections/dto/connection-dto';

import { ConnectionsPopupService } from '../services/connections-popup.service';

@Component({
  selector: 'app-delete-connections',
  imports: [],
  templateUrl: './delete-connections.component.html',
})
export class DeleteConnectionsComponent {

  data = inject(POPUP_DATA) as {
    connections: ConnectionDto[];
  };

  get connections(): ConnectionDto[] {
    return this.data.connections;
  }

  constructor(
    public connectionsPopupService: ConnectionsPopupService,
    public tService: TranslationService, 
   
  ) {
    this.tService.load('popups/delete-connections');
  }
}
