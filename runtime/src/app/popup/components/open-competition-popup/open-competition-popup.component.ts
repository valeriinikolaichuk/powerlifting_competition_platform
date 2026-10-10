import { Component } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';

import { TranslationService } from '../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';

import { PopupService } from '../../services/popup.service';
import { OpenCompetitionService } from '../../../services/shared/open-competition.service';
import { CompetitionConfigService } from '../../../services/core/competition-config.service';
import { CompetitionListItem } from '../../../services/shared/dto/competition-list-item';
import { Competition } from '../../../services/shared/dto/competition.dto';

import { CompetitionPopupComponent } from '../competition-popup/competition-popup.component';
import { EditCompetitionComponent } from '../competition-popup/edit-competition/edit-competition.component';

@Component({
  selector: 'app-open-competition-popup',
  imports: [
    TranslatePipe,
    NgClass,
    DatePipe,
  ],
  templateUrl: './open-competition-popup.component.html',
  styleUrl: './buttons.css'
})
export class OpenCompetitionPopupComponent {

  competitions: CompetitionListItem[] = [];
  selectedCompetition: Competition | null = null;

  constructor(
    public tService: TranslationService,
    private readonly popup: PopupService,
    private readonly openCompetitionService: OpenCompetitionService,
    private readonly competitionConfigService: CompetitionConfigService,
  ) {
    this.tService.load('popups/competition-popup');
    this.loadCompetitions();
  }

  private async loadCompetitions(): Promise<void> {
    this.competitions = await this.openCompetitionService.getCompetitions();
  }

  async selectCompetition(
    competition: CompetitionListItem,
  ): Promise<void> {

    if (this.selectedCompetition?.id === competition.id) {
      this.openCompetition();
      return;
    }

    this.selectedCompetition = 
      await this.openCompetitionService.getCompetitionData(competition.id);
  }

  openCompetition(): void {

    if (!this.selectedCompetition) { return; }

    console.log('OPEN', this.selectedCompetition.id,);
  }

  async changeCompetition(): Promise<void> {

    if (!this.selectedCompetition) { return; }

    console.log('EDIT', this.selectedCompetition.id,);

    this.popup.close();

    await this.popup.open(CompetitionPopupComponent, {
      content: EditCompetitionComponent,
      competition: this.selectedCompetition,
    });
  }

  async archiveCompetition(): Promise<void> {

    if (!this.selectedCompetition) { return; }

    console.log('ARCHIVE', this.selectedCompetition,);

    const confirmed = window.confirm(this.tService.t(
      'popups/competition-popup',
      'MESSAGE'
    ));

    if (!confirmed) { return; }

    await this.competitionConfigService.archive(this.selectedCompetition.id,);

    this.selectedCompetition = null;

    await this.loadCompetitions();
  }

  close(): void {
    this.popup.close();
  }
}
