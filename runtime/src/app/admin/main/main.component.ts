import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../i18n/services/translation.service';

import { PopupService } from '../../popup/services/popup.service';
import { CompetitionPopupComponent } from '../../popup/components/competition-popup/competition-popup.component';
import { CreateCompetitionComponent } from '../../popup/components/competition-popup/create-competition/create-competition.component';

@Component({
  selector: 'app-main.component',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './main.component.html',
})
export class MainComponent {

  constructor(
    private readonly router: Router,
    public tService: TranslationService,
    public popup: PopupService,
  ){}

  ngOnInit(){
    console.log('main');

    this.tService.load('pages/main');
  }

  async openCreateCompetition(): Promise<void> {

    await this.popup.open(CompetitionPopupComponent, {
      content: CreateCompetitionComponent
    });
  }
/*
  async openOpenCompetition(){

    this.popup.open(SystemPopupComponent, {
      content: SynchronizingDatabaseComponent
    });
  }
*/
  async backToAdmin(){
    
    await this.router.navigate(['/admin'])
  }
}
