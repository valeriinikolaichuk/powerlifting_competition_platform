import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, DatePipe } from '@angular/common';
import { PGlite } from '@electric-sql/pglite';

import { PgliteService } from '../../../database/services/pglite.service';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';

import { OpenCompetitionService } from '../../../services/shared/open-competition.service';
import { CheckOnlineService } from '../../../services/shared/check-online.service';
import { CompetitionListItem } from '../../../services/shared/dto/competition-list-item';
import { Competition } from '../../../services/shared/dto/competition.dto';

import { PopupService } from '../../../popup/services/popup.service';
import { CompetitionPopupComponent } from '../../../popup/components/competition-popup/competition-popup.component';
import { SetDeadlinesComponent } from '../../../popup/components/competition-popup/set-deadlines/set-deadlines.component';

@Component({
  selector: 'app-registration',
  imports: [
    TranslatePipe,
    RouterLink,
    NgClass, 
    DatePipe,
  ],
  templateUrl: './registration.component.html',
})
export class RegistrationComponent {

  buttonLeft = 0;
  isOnline = false;

  competitions: CompetitionListItem[] = [];
  selectedCompetition: Competition | null = null;

  private pg!: PGlite;

  constructor(
    public tService: TranslationService,
    private readonly pgliteService: PgliteService,
    private readonly checkOnlineService: CheckOnlineService,
    private readonly openCompetitionService: OpenCompetitionService,
    private readonly popup: PopupService,
  ) {
    this.pg = this.pgliteService.database;
    this.tService.load('pages/registration');
    this.loadCompetitions();
  }

  async ngOnInit() {
    this.isOnline = await this.checkOnlineService.checkOnline();

    if (this.isOnline) {
      this.buttonLeft = 100;
    }
  }

  private async loadCompetitions(): Promise<void> 
  {
    this.competitions = await this.openCompetitionService.getNominatedCompetitions();
  }

  async selectCompetition(
    competition: CompetitionListItem,
  ): Promise<void> {

    if (this.selectedCompetition?.id === competition.id) {
//      this.openCompetition();
      return;
    }

    this.selectedCompetition = 
      await this.openCompetitionService.getCompetitionData(competition.id);
  }

  async openDeadline(): Promise<void> {

    if (!this.selectedCompetition) { return; }

    console.log('DEADLINES', this.selectedCompetition,);

    await this.popup.open(CompetitionPopupComponent, {
      content: SetDeadlinesComponent,
      competition: this.selectedCompetition,
    });
  }
}
