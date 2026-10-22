import { Component, signal, Type } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';

import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../i18n/services/translation.service';

import { CheckOnlineService } from '../../../shared/services/check-online.service';

import { PopupService } from '../../../popup/services/popup.service';
import { CompetitionPopupComponent } from '../../../popup/components/competition-popup/competition-popup.component';
import { CreateCompetitionComponent } from '../../../popup/components/competition-popup/create-competition/create-competition.component';
import { OpenCompetitionPopupComponent } from '../../../popup/components/open-competition-popup/open-competition-popup.component';

import { NominationTable } from './nomination-table/nomination-table';
import { Competition } from '../../../shared/services/dto/competition.dto';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NgComponentOutlet,
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './main.component.html',
})
export class MainComponent {

  buttonLeft = 200;
  isOnline = false;

  tableComponent = signal<Type<unknown> | null>(null);

  selectedCompetition: Competition | null = null;

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

  // TOOLBAR

  async openCreateCompetition(): Promise<void> {

    const result = await this.popup.open<{
      action: string;
      competition: Competition;
    }>(CompetitionPopupComponent, {
      content: CreateCompetitionComponent
    });

    if (result?.action === 'open') {
      this.selectedCompetition = result.competition;
      console.log('OPEN', this.selectedCompetition);
      
      this.showNomination();
    }
  }

  async openOpenCompetition(){

    const result = await this.popup.open<{
      action: 'open';
      competition: Competition;
    }>(
      OpenCompetitionPopupComponent
    );

    if (result?.action === 'open') {
      this.selectedCompetition = result.competition;
      console.log('OPEN', this.selectedCompetition);
      
      this.showNomination();
    }
  }

  // TABLES

  showNomination(): void {
    this.tableComponent.set(NominationTable);
  }
/*
  showWeighing(): void {
    this.tableComponent.set(WeighingTableComponent);
  }

  showResults(): void {
    this.tableComponent.set(ResultsTableComponent);
  }
*/

  async backToAdmin(){
    
    await this.router.navigate(['/admin'])
  }
}
