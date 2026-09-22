import { Component } from '@angular/core';

import { ExitService } from '../../exit.service';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';

@Component({
  selector: 'app-information',
  imports: [TranslatePipe],
  templateUrl: './information.component.html',
})
export class InformationComponent {

  isLoading = true;

  constructor(
    public tService: TranslationService,
    public exitService: ExitService,
  ){}

  async ngOnInit(){
  
    this.tService.load('pages/information');

    this.isLoading = false;
    console.log('information');
  }
}
