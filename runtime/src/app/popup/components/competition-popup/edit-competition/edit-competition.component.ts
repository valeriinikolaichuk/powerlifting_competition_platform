import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

import { PopupService } from '../../../services/popup.service';
import { OpenCompetitionPopupComponent } from '../../open-competition-popup/open-competition-popup.component';

import { CompetitionConfigService } from '../../../../services/core/competition-config.service';
import { CompetitionOptionsService } from '../services/competition-options.service';

import { Competition } from '../../../../services/shared/dto/competition.dto';
import { AgeGroupOption } from '../dto/competition-options.dtos';

@Component({
  selector: 'app-edit-competition.component',
  imports: [
    ReactiveFormsModule,
    TranslatePipe, 
  ],
  templateUrl: './edit-competition.component.html',
  styleUrl: '../autocomplete.css'
})
export class EditCompetitionComponent {

  competition = input.required<Competition>();

  form!: FormGroup;

  countrySuggestion = '';
  countrySuggestionOffset = 0;
  citySuggestion = '';
  citySuggestionOffset = 0;

  ageGroups: AgeGroupOption[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public tService: TranslationService,  
    private readonly popup: PopupService, 
    private readonly competitionConfigService: CompetitionConfigService,
    private readonly competitionOptionsService: CompetitionOptionsService,
  ) {
    this.tService.load('popups/competition-popup');
  }

  async ngOnInit() {
    const competition = this.competition();

    console.log(competition);

    this.form = this.fb.group({
      competitionName: [competition.competition_name],
      country: [competition.country],
      city: [competition.city],
      startDate: [this.competitionOptionsService.formatDate(competition.start_date)],
      endDate: [this.competitionOptionsService.formatDate(competition.end_date)],
    });

    this.form.get('startDate')?.valueChanges.subscribe(
      (startDate) => {const endDate = this.form.get('endDate')?.value;

        if (startDate && endDate && startDate > endDate) {
          this.form.get('endDate')?.setValue(startDate);
        }
      },
    );

    this.form.get('endDate')?.valueChanges.subscribe(
      (endDate) => {const startDate = this.form.get('startDate')?.value;

        if (startDate && endDate && endDate < startDate) {
          this.form.get('endDate')?.setValue(startDate);
        }
      },
    );

    await this.loadAgeGroups();
  }

  // COUNTRY
  async onCountryInput(): Promise<void> {

    const value = this.form.get('country')?.value?.trim() ?? '';

    this.countrySuggestion = '';

    if (!value) { return; }

    const suggestion = await this.competitionOptionsService.getCountrySuggestion(value);

    this.countrySuggestionOffset = this.getTextWidth(value);

    if (
        suggestion &&
        suggestion.toLowerCase() !== value.toLowerCase()
    ) {
        this.countrySuggestion = suggestion.slice(value.length);
    }
  }

  acceptCountrySuggestion(): void {

    if (!this.countrySuggestion) { return; }

    const value = this.form.get('country')?.value ?? '';

    this.form.get('country')?.setValue(value + this.countrySuggestion);

    this.countrySuggestion = '';
  }

  // CITY
  async onCityInput(): Promise<void> {

    const value = this.form.get('city')?.value?.trim() ?? '';

    this.citySuggestion = '';

    if (!value) { return; }

    const countryName = this.form.get('country')?.value?.trim() ?? '';

    const suggestion = await this.competitionOptionsService.getCitySuggestion(
      value,
      countryName,
    );

    this.citySuggestionOffset = this.getTextWidth(value);

    if (
        suggestion && 
        suggestion.toLowerCase() !== value.toLowerCase()
    ) {
        this.citySuggestion = suggestion.slice(value.length);
    }
  }

  acceptCitySuggestion(): void {

    if (!this.citySuggestion) { return; }

    const value = this.form.get('city')?.value ?? '';

    this.form.get('city')?.setValue(value + this.citySuggestion);

    this.citySuggestion = '';
  }

  public getTextWidth(text: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return 0;

    const input = document.querySelector('.autocomplete-input') as HTMLInputElement;

    context.font = getComputedStyle(input).font;

    return context.measureText(text).width;
  }

  // AGE GROUP
  async loadAgeGroups(): Promise<void> {
    const competition = this.competition();

    const federationId = competition.federation_id ?? '';
    const sex = competition.age_groups[0]?.sex ?? '';

    if (!federationId || !sex) {
      this.ageGroups = [];
      return;
    }

    this.ageGroups = await this.competitionOptionsService.getAgeGroups(
      federationId,
      sex,
    );
  }

  getAgeGroupLabel(ageGroup: AgeGroupOption): string {

    const key =`${ageGroup.federation_code}_${ageGroup.name}_${ageGroup.sex}`;

    const translated = this.tService.t(
      'popups/competition-popup',
      key,
    );

    return translated === key
      ? ageGroup.name
      : translated;
  }

  isExistingAgeGroup(id: string): boolean {
    return this.competition()
      .age_groups
      .some(ageGroup => ageGroup.federation_category_id === id);
  }

  // EDIT
  async edit(): Promise<void> {

    const value = this.form.getRawValue();

    const isValid = await this.competitionOptionsService.validateForm(
      value.competitionName,
      value.country,
      value.city,
    );

    if (!isValid) { return; }

    const competition = this.competition();

    const language = localStorage.getItem('lang')?.toUpperCase();
    const now = new Date().toISOString();

    await this.competitionConfigService.update({
      id: competition.id,
      name: value.competitionName!.trim(),
      country: value.country!.trim(),
      city: value.city!.trim(),
      startDate: value.startDate!,
      endDate: value.endDate!,
      language: language!,
      updated_at: now,
    });

    this.popup.close();
    this.popup.open(OpenCompetitionPopupComponent);
  }

  close(): void {
    this.popup.close();
    this.popup.open(OpenCompetitionPopupComponent);
  }
}
