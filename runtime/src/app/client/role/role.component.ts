import { Component } from '@angular/core';

import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../i18n/services/translation.service';
import { ExitService } from '../../services/exit.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './role.component.html',
})
export class RoleComponent {

  isLoading = true;

  constructor(
    public tService: TranslationService,
    public exitService: ExitService,
  ){}

  async ngOnInit(){
  
    this.tService.load('pages/entry');

    this.isLoading = false;
    console.log('role');
  }
}
