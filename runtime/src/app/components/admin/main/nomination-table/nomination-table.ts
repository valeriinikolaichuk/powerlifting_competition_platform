import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../../i18n/services/translation.service';

import { AthleteTableColumn } from '../models/athlete-table-column.interface';
import { NOMINATION_COLUMNS } from '../config/nomination-columns';

import { ColumnFactoryService } from '../services/column-factory.service';
import { ColumnContext } from '../config/column-context';
import { ColspanConfigDto } from '../config/colspan.dto';

import { AthleteTableOptionsService } from '../services/athlete-table-options.service';
import { Competition } from '../../../../shared/services/dto/competition.dto';
import { AthleteCellValue, AthleteCompetitionRow } from '../models/athlete-competition-row.interface';

import { SuggestionService } from '../../../../shared/services/suggestion.service';
import { AutocompleteFactoryService } from '../../../../shared/services/autocomplete/autocomplete-factory.service';
import { AutocompleteField } from '../types/autocomplete-field.type';
import { organizationTypes } from '../types/organization-types';

@Component({
  selector: 'app-nomination-table',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './nomination-table.html',
  styleUrls: [
    '../styles/nomination-table.css',
    '../../../../shared/styles/autocomplete.css',
  ],
})
export class NominationTable implements OnChanges {

  @Input() competition!: Competition;

  @Input() athletes: AthleteCompetitionRow[] = [];
  @Input() categories: string[] = [];
  @Input() ageGroups: string[] = [];
  @Input() weightClasses: { id: string; name: string }[] = [];
  @Input() editable = true;

  columns: AthleteTableColumn[] = NOMINATION_COLUMNS.map(column => ({ ...column }));
  competitionColspan = 0;
  infoColspan = 0;
  referenceColspan = 0;
  diciplineColspan = 0;

  readonly groupOptions = Array.from({ length: 9 }, (_, index) => index + 1);
  readonly dayOptions = Array.from({ length: 32 }, (_, index) => index);
  readonly monthOptions = Array.from({ length: 13 }, (_, index) => index);
  readonly yearOptions = [0, ...Array.from({ length: 81 }, (_, index) => 2015 - index)];

  newAthlete: Partial<AthleteCompetitionRow> = {};

  countrySuggestion = '';
  regionSuggestion = '';
  citySuggestion = '';
  athleteSuggestion = '';

  constructor(
    public tService: TranslationService,
    private readonly columnFactoryService: ColumnFactoryService,
    private readonly athleteTableOptionsService: AthleteTableOptionsService,
    private readonly suggestionService: SuggestionService,
    private readonly autocompleteFactoryService: AutocompleteFactoryService,
  ){}

  async ngOnInit(){
    this.tService.load('tables/athlete-table');

    this.newAthlete = this.createEmptyAthlete();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {

    if (!this.competition) { return; }

    this.configureColumns();

    if (changes['competition'] && this.competition) {

      this.athletes = await this.athleteTableOptionsService.getAthletes(
        this.competition.id
      );

      this.weightClasses = [];

      const ageGroup = this.competition.age_groups[0];

      this.newAthlete = {
        ...this.createEmptyAthlete(),
        age_group: ageGroup?.federation_category_id ?? '',
        weight_class: '',
      };

      if (ageGroup) {
        this.weightClasses =
          await this.athleteTableOptionsService.getWeightClasses(
            ageGroup.federation_category_id
          );
      }
    }
  }

  getLabel(column: AthleteTableColumn): string {
    return this.tService.t(column.translationScope, column.title);
  }

  trackColumn(_: number, column: AthleteTableColumn): number { return column.index; }
  trackAthlete(_: number, athlete: AthleteCompetitionRow): string | number { return athlete.id; }

  private configureColumns(): void {

    const context: ColumnContext = {
      lang: localStorage.getItem('lang'),
      competitionLevel: this.competition.competition_level,
      competitionType: this.competition.type,
      ageGroupsCount: this.competition.age_groups.length,
      federationCode: this.competition.federation_code,
    };

    const colspanConfig: ColspanConfigDto = {
      competitionColspan: 20,
      infoColspan: 9,
      referenceColspan: 7,
      diciplineColspan: 4,
    };

    const config = this.columnFactoryService.createTableConfig(
      NOMINATION_COLUMNS,
      context,
      colspanConfig,
    );

    this.columns = config.columns;
    this.competitionColspan = config.competitionColspan;
    this.infoColspan = config.infoColspan;
    this.referenceColspan = config.referenceColspan;
    this.diciplineColspan = config.diciplineColspan;
  }

  getColumnLeft(column: AthleteTableColumn): number | null {
    if (column.left === null) return null;

    const ageGroupHidden = this.competition?.age_groups?.length === 1;

    if (ageGroupHidden && column.index > 6) {
      return column.left - 130;
    }

    return column.left;
  }

  displayValue(
    athlete: AthleteCompetitionRow, 
    column: AthleteTableColumn
  ): AthleteCellValue {

    if (column.index === 1) return this.athletes.indexOf(athlete) + 1;
    if (!column.field) return '';

    const value = athlete[column.field];

    if (
      ['birth_day', 'birth_month', 'birth_year'].includes(column.field)
      && (!value || value === 0)
    ) {
      return '';
    }

    if (value === null || value === undefined) return '';

    if (column.editor === 'checkbox') { return Boolean(value); }

    return value;
  }

  setNewNumber(
    field: string | null, 
    event: Event
  ): void {
    if (!field) return;

    const raw = (event.target as HTMLInputElement).value;

    this.newAthlete[field] = raw === '' ? null : Number(raw);
  }

  setNewText(
    field: string | null, 
    event: Event
  ): void {
    if (!field) return;

    this.newAthlete[field] = (event.target as HTMLInputElement).value;
  }

  onDatePartChange(
    field: 'birth_day' | 'birth_month' | 'birth_year', 
    event: Event
  ): void {
    const raw = (event.target as HTMLSelectElement).value;
    const parsed = raw === '' ? null : Number(raw);

    this.newAthlete[field] = parsed === 0 ? null : parsed;
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

    this.newAthlete['age_group'] = federationCategoryId;
    this.newAthlete['weight_class'] = '';

    this.weightClasses 
      = await this.athleteTableOptionsService.getWeightClasses(federationCategoryId);
  }

  createEmptyAthlete(): Partial<AthleteCompetitionRow> {
    return {
      id: crypto.randomUUID(),
      full_name: null,
      birth_day: null,
      birth_month: null,
      birth_year: null,

      age_group: this.competition.age_groups[0]?.federation_category_id ?? '',
      weight_class: null,
      group_order: 1,
      lot: null,
      sport_rank_class: null,

      country: null,
      region: null,
      city: null,

      sport_society_code: null,
      club_code: null,
      sport_school_code: null,
      university_code: null,

      trener_1: null,
      trener_2: null,
      trener_3: null,
      trener_4: null,

      squat_nominated: null,
      bench_press_nominated: null,
      deadlift_nominated: null,
      total_nominated: null,
      status: 'TEAM',
      qualification: 'QUALIFIED',
      titles: null,
    };
  }

  resetNewAthlete(): void { 
    this.newAthlete = this.createEmptyAthlete(); 
  }

  addAthlete(): void {
    const fullName = String(this.newAthlete['full_name'] ?? '').trim();

    if (!fullName) return;

    this.newAthlete = {
      ...this.newAthlete,
      ['full_name']: fullName,
    };
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

    let value = String(this.newAthlete[field] ?? '').trim();

    this.setSuggestion(field, '');

    if (!value) return;

    let suggestion: string | null = null;

    const context = {
      federationId: this.competition.federation_id,
      language: localStorage.getItem('lang')?.toUpperCase() ?? 'EN',
      competitionSex: this.competition.age_groups[0].sex,
      regionName: String(this.newAthlete['region'] ?? '').trim(),
      countryName: String(this.newAthlete['country'] ?? '').trim(),
      organizationType: organizationTypes[field] ,
    };

    const strategy = this.autocompleteFactoryService.getStrategy(field);

    if (!strategy) return;

    suggestion = await strategy.getSuggestion(value, context);

    if (String(this.newAthlete[field] ?? '').trim() !== value) return;

    if (
      suggestion &&
      suggestion.toLowerCase().startsWith(value.toLowerCase()) &&
      suggestion.toLowerCase() !== value.toLowerCase()
    ) {
      this.setSuggestion(field, suggestion.slice(value.length));
    }
  }

  async acceptSuggestion(field: string | null): Promise<void> {
    if (!field || !this.isAutocompleteField(field)) return;

    const suggestion = this.getSuggestion(field);

    if (!suggestion) return;

    const value = String(this.newAthlete[field] ?? '');

    this.newAthlete[field] = value + suggestion;
    this.setSuggestion(field, '');

    if (field === 'full_name') {
      const language = localStorage.getItem('lang')?.toUpperCase() ?? 'EN';
      const competitionSex = this.competition.age_groups[0].sex;
      let sex;

      if (competitionSex === 'MEN') {
        sex = 'MAN';
      } else {
        sex = 'WOMAN';
      }

      if (!sex) return;

      const athlete = await this.suggestionService.getDateOfBirthByName(
        String(this.newAthlete['full_name']),
        this.competition.federation_id,
        language,
        sex,
      );

      if (athlete) {
        this.newAthlete['birth_day'] = athlete.birth_day;
        this.newAthlete['birth_month'] = athlete.birth_month;
        this.newAthlete['birth_year'] = athlete.birth_year;
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

  getNewAthleteValue(field: string): string {
    return String(this.newAthlete[field] ?? '');
  }
}

