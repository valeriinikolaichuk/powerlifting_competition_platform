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
import { Competition } from '../../../../services/shared/dto/competition.dto';
import { AthleteCellValue, AthleteCompetitionRow } from '../models/athlete-competition-row.interface';

@Component({
  selector: 'app-nomination-table',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './nomination-table.html',
  styleUrl: '../styles/nomination-table.css',
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

  constructor(
    public tService: TranslationService,
    private readonly columnFactoryService: ColumnFactoryService,
    private readonly athleteTableOptionsService: AthleteTableOptionsService,
  ){}

  async ngOnInit(){
    this.tService.load('tables/athlete-table');

    this.newAthlete = this.createEmptyAthlete();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {

    if (!this.competition) { return; }

    this.configureColumns();

    if (changes['competition'] && this.competition) {

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
  
  isChecked(
    athlete: AthleteCompetitionRow, 
    field: string | null
  ): boolean {
    if (!field) return false;

    return Boolean(athlete[field]);
  }

  isNewChecked(
    field: string | null
  ): boolean {
    if (!field) return false;

    return Boolean(this.newAthlete[field]);
  }

  setNewCheckbox(
    field: string | null, 
    event: Event
  ): void {
    if (!field) return;

    this.newAthlete[field] = (event.target as HTMLInputElement).checked;
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
      id: -1,
      full_name: '',
      birth_day: null,
      birth_month: null,
      birth_year: null,
      age_group: this.competition.age_groups[0]?.federation_category_id ?? '',
      weight_class: '',
      groups_in_session: 1,
      lot: null,
      sport_rank_class: '',
      country: '',
      region: '',
      city: '',
      sport_society_code: '',
      club_code: '',
      sport_school_code: '',
      university_code: '',
      trener_1: '',
      trener_2: '',
      trener_3: '',
      trener_4: '',
      squat_nominated: null,
      bench_press_nominated: null,
      deadlift_nom: null,
      total_nom: null,
      personally: false,
      out_of_comp: false,
      disqualified: false,
      titles: '',
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
}

