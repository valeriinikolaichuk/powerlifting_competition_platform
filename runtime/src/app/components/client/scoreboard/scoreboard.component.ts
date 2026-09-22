import { Component } from '@angular/core';

import { ExitService } from '../../exit.service';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';

@Component({
  selector: 'app-scoreboard',
  imports: [TranslatePipe],
  templateUrl: './scoreboard.component.html',
})
export class ScoreboardComponent {

  isLoading = true;

  constructor(
    public tService: TranslationService,
    public exitService: ExitService,
  ){}

  async ngOnInit(){
  
    this.tService.load('pages/scoreboard');

    this.isLoading = false;
    console.log('scoreboard');
  }
}
