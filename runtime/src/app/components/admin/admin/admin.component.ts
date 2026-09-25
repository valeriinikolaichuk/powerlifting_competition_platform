import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DeviceReceiverService } from '../../../services/connections/services/device-receiver.service';
import { SyncQueueService } from '../../../services/sync/services/sync-queue.service';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';
import { ExitService } from '../../../services/shared/exit.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './admin.component.html'
})
export class AdminComponent {

  isLoading = true;

  constructor(
    private readonly deviceReceiverService: DeviceReceiverService,
    private readonly syncQueueService: SyncQueueService,
    public tService: TranslationService,
    public exitService: ExitService,
  ){}

  async ngOnInit(){
    
    this.syncQueueService.start();
    
    this.tService.load('pages/entry');

    this.isLoading = false;
    console.log('admin');
  }
}
