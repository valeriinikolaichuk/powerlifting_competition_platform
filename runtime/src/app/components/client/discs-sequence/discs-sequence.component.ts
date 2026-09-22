import { Component } from '@angular/core';

import { ExitService } from '../../exit.service';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';

@Component({
  selector: 'app-discs-sequence',
  imports: [TranslatePipe],
  templateUrl: './discs-sequence.component.html',
})
export class DiscsSequenceComponent {

  isLoading = true;

  constructor(
    public tService: TranslationService,
    public exitService: ExitService,
  ){}

  async ngOnInit(){
  
    this.tService.load('pages/discs-sequence');

    this.isLoading = false;
    console.log('discs-sequence');
  }
}
