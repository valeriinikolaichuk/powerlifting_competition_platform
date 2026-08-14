import { Component } from '@angular/core';

import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../i18n/services/translation.service';
import { ExitService } from '../services/exit.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './admin.component.html'
})
export class AdminComponent {

  constructor(
    public tService: TranslationService,
    public exitService: ExitService,
  ){}

  ngOnInit(){
    console.log('admin');

    this.tService.load('pages/role');
  }
}
