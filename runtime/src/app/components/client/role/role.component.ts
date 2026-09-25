import { Component } from '@angular/core';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';
import { EntryService } from '../../../services/shared/entry.service';
import { ExitService } from '../../../services/shared/exit.service';

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
    public entryService: EntryService,
  ){}

  async ngOnInit(){
  
    this.tService.load('pages/entry');

    this.isLoading = false;
    console.log('role');
  }
}
