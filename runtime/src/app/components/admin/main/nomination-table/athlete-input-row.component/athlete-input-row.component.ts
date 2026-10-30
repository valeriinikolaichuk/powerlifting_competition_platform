import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TranslatePipe } from '../../../../../i18n/pipes/translate.pipe';

import { AthleteTableOptionsService } from '../../services/athlete-table-options.service';
import { Competition } from '../../../../../shared/services/dto/competition.dto';

import { SuggestionService } from '../../../../../shared/services/suggestion.service';
import { AutocompleteFactoryService } from '../../../../../shared/services/autocomplete/autocomplete-factory.service';
import { AutocompleteField } from '../../types/autocomplete-field.type';
import { organizationTypes } from '../../types/organization-types';

import { AthleteTableColumn } from '../../models/athlete-table-column.interface';

@Component({
  selector: 'tr[app-athlete-input-row]',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './athlete-input-row.component.html',
  styleUrls: [
    '../../../../../shared/styles/autocomplete.css',
    '../../styles/table.css',
    '../../styles/input-line.css',  
  ],
})
export class AthleteInputRowComponent {

  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) columns!: AthleteTableColumn[];
  @Input({ required: true }) competition!: Competition;
  @Input() weightClasses: { id: string; name: string }[] = [];
  @Input() editable = true;

  readonly groupOptions = Array.from({ length: 9 }, (_, index) => index + 1);
  readonly dayOptions = Array.from({ length: 32 }, (_, index) => index);
  readonly monthOptions = Array.from({ length: 13 }, (_, index) => index);
  readonly yearOptions = [0, ...Array.from({ length: 81 }, (_, index) => 2015 - index)];

  countrySuggestion = '';
  regionSuggestion = '';
  citySuggestion = '';
  athleteSuggestion = '';

  constructor(
    private readonly athleteTableOptionsService: AthleteTableOptionsService,
    private readonly suggestionService: SuggestionService,
    private readonly autocompleteFactoryService: AutocompleteFactoryService,
  ){}

  trackColumn(_: number, column: AthleteTableColumn): number { return column.index; }

  getColumnLeft(column: AthleteTableColumn): number | null {
    if (column.left === null) return null;

    const ageGroupHidden = this.competition?.age_groups?.length === 1;

    if (ageGroupHidden && column.index > 6) {
      return column.left - 130;
    }

    return column.left;
  }

  onDatePartChange(
    field: 'birth_day' | 'birth_month' | 'birth_year', 
    event: Event
  ): void {
    const raw = (event.target as HTMLSelectElement).value;
    const parsed = raw === '' ? null : Number(raw);

    this.form.get(field)?.setValue(parsed === 0 ? null : parsed);
  }

  formatDatePart(
    value: number | null | undefined
  ): string {
    return !value ? '' : String(value).padStart(2, '0');
  }

  async onAgeGroupChange(
    event: Event
  ): Promise<void> {
    const federationCategoryId = (event.target as HTMLSelectElement).value;

    this.form.patchValue({
      age_group: federationCategoryId,
      weight_class: null,
    });

    this.weightClasses = 
        await this.athleteTableOptionsService.getWeightClasses(federationCategoryId);
  }

  // AUTOCOMPLETE
  
  getSuggestion(field: string | null | undefined): string {
    switch (field) {
      case 'full_name':
        return this.athleteSuggestion;
      case 'country':
        return this.countrySuggestion;
      case 'region':
        return this.regionSuggestion;
      case 'city':
        return this.citySuggestion;
      default:
        return '';
    }
  }
  
  async onAutocompleteInput(
    field: string | null,
  ): Promise<void> {
    if (!field || !this.isAutocompleteField(field)) return;
  
    let value = String(this.form.get(field)?.value ?? '').trim();
  
    this.setSuggestion(field, '');
  
    if (!value) return;
  
    let suggestion: string | null = null;
  
    const context = {
      federationId: this.competition.federation_id,
      language: localStorage.getItem('lang')?.toUpperCase() ?? 'EN',
      competitionSex: this.competition.age_groups[0].sex,
      regionName: String(this.form.get('region')?.value ?? '').trim(),
      countryName: String(this.form.get('country')?.value ?? '').trim(),
      organizationType: organizationTypes[field] ,
    };
  
    const strategy = this.autocompleteFactoryService.getStrategy(field);
  
    if (!strategy) return;
  
    suggestion = await strategy.getSuggestion(value, context);
  
    if (String(this.form.get(field)?.value ?? '').trim() !== value) return;
  
    if (
      suggestion &&
      suggestion.toLowerCase().startsWith(value.toLowerCase()) &&
      suggestion.toLowerCase() !== value.toLowerCase()
    ) {
      this.setSuggestion(field, suggestion.slice(value.length));
    }
  }
  
  async acceptSuggestion(
    field: string | null
  ): Promise<void> {
    if (!field || !this.isAutocompleteField(field)) return;
  
    const suggestion = this.getSuggestion(field);
    if (!suggestion) return;
  
    const control = this.form.get(field);
    if (!control) return;
  
    const value = String(control.value ?? '');
  
    control.setValue(value + suggestion);
    this.setSuggestion(field, '');
  
    if (field === 'full_name') {
      const language = localStorage.getItem('lang')?.toUpperCase() ?? 'EN';
      const competitionSex = this.competition.age_groups[0].sex;
  
      const sex = competitionSex === 'MEN' ? 'MAN' : 'WOMAN';
  
      const athlete = await this.suggestionService.getDateOfBirthByName(
        String(this.form.get('full_name')?.value ?? ''),
        this.competition.federation_id,
        language,
        sex,
      );
  
      if (athlete) {
        this.form.patchValue({
          birth_day: athlete.birth_day,
          birth_month: athlete.birth_month,
          birth_year: athlete.birth_year,
        });
      }
    }
  }
  
  private setSuggestion(
    field: AutocompleteField,
    value: string,
  ): void {
    switch (field) {
      case 'full_name':
        this.athleteSuggestion = value;
        break;
      case 'country':
        this.countrySuggestion = value;
        break;
      case 'region':
        this.regionSuggestion = value;
        break;
      case 'city':
        this.citySuggestion = value;
        break;
    }
  }
  
  public isAutocompleteField(
    field: string | null | undefined,
  ): field is AutocompleteField {
    return [
      'full_name',
      'country',
      'region',
      'city',
    ].includes(field ?? '');
  }
  
  public getTextWidth(text: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    if (!context) return 0;
  
    const input = document.querySelector(
      '.autocomplete-input',
    ) as HTMLInputElement | null;
  
    if (!input) return 0;
  
    context.font = getComputedStyle(input).font;
  
    return context.measureText(text).width;
  }
  
  getNewAthleteValue(
    field: string
  ): string {
    return String(this.form.get(field)?.value ?? '');
  }
}
