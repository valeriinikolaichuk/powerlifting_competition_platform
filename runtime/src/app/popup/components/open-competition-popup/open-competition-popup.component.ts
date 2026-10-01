import { Component } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';

import { TranslationService } from '../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';

import { PopupService } from '../../services/popup.service';
import { OpenCompetitionService } from '../../../services/core/open-competition.service';
import { CompetitionListItem } from './dto/competition-list-item';
import { Competition } from './dto/competition.dto';
import { AgeGroupOption } from '../competition-popup/dto/competition-options.dtos';

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
  ageGroups: AgeGroupOption[] = [];

  constructor(
    public tService: TranslationService,
    private readonly popup: PopupService,
    private readonly openCompetitionService: OpenCompetitionService,
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

    if (!this.selectedCompetition) {
      return;
    }

    console.log(
      'OPEN',
      this.selectedCompetition,
    );
  }

  changeCompetition(): void {

    if (!this.selectedCompetition) {
      return;
    }

    console.log(
      'CHANGE',
      this.selectedCompetition,
    );
  }

  onlineRegistration(): void {

    if (!this.selectedCompetition) {
      return;
    }

    console.log(
      'ONLINE REG',
      this.selectedCompetition,
    );
  }

  deleteCompetition(): void {

    if (!this.selectedCompetition) {
      return;
    }

    console.log(
      'DELETE',
      this.selectedCompetition,
    );
  }

  close(): void {
    this.popup.close();
  }
}
