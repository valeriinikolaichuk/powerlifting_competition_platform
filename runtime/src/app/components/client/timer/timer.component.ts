import { Component } from '@angular/core';

import { ExitService } from '../../../services/shared/exit.service';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';

@Component({
  selector: 'app-timer',
  imports: [TranslatePipe],
  templateUrl: './timer.component.html',
})
export class TimerComponent {

  isLoading = true;

  constructor(
    public tService: TranslationService,
    public exitService: ExitService,
  ){}

  async ngOnInit(){
  
    this.tService.load('pages/timer');

    this.isLoading = false;
    console.log('timer');
  }
}
