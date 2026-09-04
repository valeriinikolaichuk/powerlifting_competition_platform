import { Component, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, } from '@angular/forms';

import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

import { PopupService } from '../../../services/popup.service';
import { CompetitionPopupService } from '../services/competition-popup.service';
import { CompetitionOptionsService } from '../services/competition-options.service';

import { 
  FederationOption, 
  COMPETITION_LEVELS, 
  COMPETITION_TYPES, 
} from '../dto/competition-options.dtos';

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
  federations: FederationOption[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public tService: TranslationService,  
    private readonly popup: PopupService, 
    private readonly competitionPopupService: CompetitionPopupService, 
    private readonly competitionOptionsService: CompetitionOptionsService,
  ) {
    this.form = this.fb.group({
      competitionName: [''],
      country: [''],
      city: [''],
      startDate: [''],
      endDate: [''],
      federation: [''],
      level: [''],
      type: [''],
      division: [''],
      sex: [''],
      ageGroup: [''],
    });

    this.tService.load('popups/competition-popup');
  }

  readonly levels = computed(() => {
    const lang = this.tService.lang();

    if (lang === 'en') {
      return COMPETITION_LEVELS;
    }

    return COMPETITION_LEVELS.filter(
      level => level !== 'INTERNATIONAL'
    );
  });

  readonly types = COMPETITION_TYPES;

  async ngOnInit(): Promise<void> {

    this.federations = await this.competitionOptionsService.getFederations();
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
      federation: value.federation ?? '',
      level: value.level ?? '',
      type: value.type ?? '',
      division: value.division ?? '',
      sex: value.sex ?? '',
      ageGroup: value.ageGroup ?? '',
    });
  }

  close(): void {
    this.popup.close();
  }
}
