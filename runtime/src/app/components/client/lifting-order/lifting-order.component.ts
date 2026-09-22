import { Component } from '@angular/core';

import { ExitService } from '../../exit.service';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';

@Component({
  selector: 'app-lifting-order',
  imports: [TranslatePipe],
  templateUrl: './lifting-order.component.html',
})
export class LiftingOrderComponent {

  isLoading = true;

  constructor(
    public tService: TranslationService,
    public exitService: ExitService,
  ){}

  async ngOnInit(){
  
    this.tService.load('pages/lifting-order');

    this.isLoading = false;
    console.log('lifting-order');
  }
}
