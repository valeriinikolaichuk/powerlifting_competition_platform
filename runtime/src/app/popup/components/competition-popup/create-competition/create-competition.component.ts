import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, } from '@angular/forms';

import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

import { PopupService } from '../../../services/popup.service';
import { CompetitionPopupService } from '../services/competition-popup.service';

@Component({
  selector: 'app-create-competition',
  imports: [
    ReactiveFormsModule,
    TranslatePipe, 
  ],
  templateUrl: './create-competition.component.html',
})
export class CreateCompetitionComponent {

  form;

  constructor(
    private readonly fb: FormBuilder,
    public tService: TranslationService,  
    private readonly popup: PopupService, 
    private readonly competitionPopupService: CompetitionPopupService, 
  ) {
    this.form = this.fb.group({
      competitionName: [''],
      country: [''],
      city: [''],
      startDate: [''],
      endDate: [''],
      division: [''],
      sex: [''],
      ageGroup: [''],
      type: [''],
      federation: [''],
    });

    this.tService.load('popups/competition-popup');
  }

  async create(): Promise<void> {

    const value = this.form.getRawValue();

    const id = crypto.randomUUID();

    await this.competitionPopupService.create({
      id,
      name: value.competitionName ?? '',
      country: value.country ?? '',
      city: value.city ?? '',
      startDate: value.startDate ?? '',
      endDate: value.endDate ?? '',
      division: value.division ?? '',
      ageGroup: value.ageGroup ?? '',
      sex: value.sex ?? '',
      type: value.type ?? '',
      federation: value.federation ?? '',
    });
  }

  close(): void {
    this.popup.close();
  }
}
