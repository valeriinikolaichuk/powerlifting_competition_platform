import { Component } from '@angular/core';

import { ExitService } from '../../exit.service';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';

@Component({
  selector: 'app-weighing-in',
  imports: [TranslatePipe],
  templateUrl: './weighing-in.component.html',
})
export class WeighingInComponent {

  isLoading = true;

  constructor(
    public tService: TranslationService,
    public exitService: ExitService,
  ){}

  async ngOnInit(){
  
    this.tService.load('pages/weighing-in');

    this.isLoading = false;
    console.log('weighing-in');
  }
}
