import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PgliteService } from '../../database/services/pglite.service';
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

  isLoading = true;

  constructor(
    private readonly router: Router,
    private readonly pgliteService: PgliteService,
    public tService: TranslationService,
    public exitService: ExitService,
  ){}

  async ngOnInit(){
    
    await this.pgliteService.initialize();
    this.tService.load('pages/entry');

    this.isLoading = false;
    console.log('admin');
  }

  async openMainPage(){

    await this.router.navigate(['/main'])
  }
}
