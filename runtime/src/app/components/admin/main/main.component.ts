import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';

import { CheckOnlineService } from '../../../services/shared/check-online.service';

import { PopupService } from '../../../popup/services/popup.service';
import { CompetitionPopupComponent } from '../../../popup/components/competition-popup/competition-popup.component';
import { CreateCompetitionComponent } from '../../../popup/components/competition-popup/create-competition/create-competition.component';
import { OpenCompetitionPopupComponent } from '../../../popup/components/open-competition-popup/open-competition-popup.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './main.component.html',
})
export class MainComponent {

  buttonLeft = 200;
  isOnline = false;

  constructor(
    private readonly router: Router,
    public tService: TranslationService,
    private readonly checkOnlineService: CheckOnlineService,
    public popup: PopupService,
  ){}

  async ngOnInit(){
    console.log('main');

    this.isOnline = await this.checkOnlineService.checkOnline();

    if (this.isOnline) {
      this.buttonLeft = 300;
    }

    this.tService.load('pages/main');
  }

  async openCreateCompetition(): Promise<void> {

    await this.popup.open(CompetitionPopupComponent, {
      content: CreateCompetitionComponent
    });
  }

  async openOpenCompetition(){

    this.popup.open(OpenCompetitionPopupComponent);
  }

  async backToAdmin(){
    
    await this.router.navigate(['/admin'])
  }
}
