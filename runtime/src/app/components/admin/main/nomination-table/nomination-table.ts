import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../../../i18n/services/translation.service';

import { AthleteTableColumn } from '../models/athlete-table-column.interface';
import { NOMINATION_COLUMNS } from '../config/nomination-columns';

import { ColumnFactoryService } from '../services/column-factory.service';
import { ColumnContext } from '../config/column-context';
import { ColspanConfigDto } from '../config/colspan.dto';

import { AthleteTableOptionsService } from '../services/athlete-table-options.service';
import { Competition } from '../../../../shared/services/dto/competition.dto';
import { AthleteCompetitionRow } from '../models/athlete-competition-row.interface';
import { AthleteCellValue } from '../types/athlete-cell.type';

import { SuggestionService } from '../../../../shared/services/suggestion.service';
import { AutocompleteFactoryService } from '../../../../shared/services/autocomplete/autocomplete-factory.service';
import { AutocompleteField } from '../types/autocomplete-field.type';
import { organizationTypes } from '../types/organization-types';

import { SortingService } from '../services/sorting.service';
import type { SortType, SortDirection } from '../types/sorting.types';
import { DragAndDropService } from '../services/drag-and-drop.service';
import { ColumnResizeService } from '../services/column-resize.service';

@Component({
  selector: 'app-nomination-table',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './nomination-table.html',
  styleUrls: [
    '../styles/nomination-table.css',
    '../../../../shared/styles/autocomplete.css',
  ],
})
export class NominationTable implements OnChanges {

  form!: FormGroup;

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

  countrySuggestion = '';
  regionSuggestion = '';
  citySuggestion = '';
  athleteSuggestion = '';

  private originalAthletes: AthleteCompetitionRow[] = [];

  private sortState: {
    field: string;
    type: SortType;
    direction: SortDirection;
  } | null = null;

  private dragIndex = -1;

  newAthlete: Partial<AthleteCompetitionRow> = {};
  editedAthletes: AthleteCompetitionRow[] = [];
  editingAthleteId: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    public tService: TranslationService,
    private readonly columnFactoryService: ColumnFactoryService,
    private readonly athleteTableOptionsService: AthleteTableOptionsService,
    private readonly suggestionService: SuggestionService,
    private readonly autocompleteFactoryService: AutocompleteFactoryService,
    private readonly sortingService: SortingService,
    private readonly dragAndDropService: DragAndDropService,
    private readonly columnResizeService: ColumnResizeService,
  ){}

  async ngOnInit(){
    this.tService.load('tables/athlete-table');

    this.resetNewAthlete();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {

    if (!this.competition) { return; }

    this.configureColumns();

    if (changes['competition'] && this.competition) {

      this.athletes = await this.athleteTableOptionsService.getAthletes(
        this.competition.id
      );

      this.originalAthletes = [...this.athletes];

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

    return value;
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

  // NEW ATHLETE

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

    this.form = this.fb.group({
      ...this.newAthlete,
      full_name: [
        this.newAthlete.full_name,
        Validators.required,
      ],
    });
  }

  onNewAthleteKeydown(event: Event): void {
    event.preventDefault();
    this.addAthlete();
  }

  addAthlete(): void {
    const fullName = String(this.form.get('full_name')?.value ?? '').trim();

    if (!fullName) {
      this.form.get('full_name')?.setErrors({ required: true });
      return;
    }

    const athlete = {
      ...this.newAthlete,
      ...this.form.getRawValue(),
      full_name: fullName,
    } as AthleteCompetitionRow;

    this.athletes = [athlete, ...this.athletes];

    this.resetNewAthlete();
  }

/*
const changes: AthleteChange[] = [
  {
    operation: 'INSERT',
    data: newAthlete as AthleteCompetitionRow,
  },
  ...editedAthletes.map(data => ({
    operation: 'UPDATE' as const,
    data,
  })),
];

*/



  // EDIT ATHLETE

  startEditing(
    athlete: AthleteCompetitionRow
  ): void {
    this.editingAthleteId = athlete.id;
  }

  isEditing(
    athlete: AthleteCompetitionRow
  ): boolean {
    return this.editingAthleteId === athlete.id;
  }

  stopEditing(): void {
    this.editingAthleteId = null;
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

  // SORTING

  setAthletes(athletes: AthleteCompetitionRow[]): void {

    this.originalAthletes = athletes.map(athlete => ({ ...athlete }));
    this.athletes = [...athletes];
    this.sortState = null;
  }

  onSort(column: AthleteTableColumn): void {

    if (column.index === 1) {
      this.resetSorting();
      return;
    }

    if (
      column.cancelSorting ||
      !column.field ||
      !column.sortType
    ) {
      return;
    }

    const type = column.sortType;

    if (type !== 'number' && type !== 'string') {
      return;
    }

    const direction: SortDirection =
      this.sortState?.field === column.field &&
      this.sortState.direction === 'asc'
        ? 'desc'
        : 'asc';

    this.sortState = {
      field: column.field,
      type,
      direction,
    };

    this.athletes = this.sortingService.sort(
      this.athletes,
      column.field,
      type,
      direction,
    );
  }

  resetSorting(): void {

    if (this.originalAthletes.length === 0) {
      return;
    }

    this.athletes = [...this.originalAthletes];
    this.sortState = null;
  }

  getSortIcon(column: AthleteTableColumn): string {
    if (this.sortState?.field !== column.field) {
      return '';
    }

    return this.sortState.direction === 'asc' ? '↑' : '↓';
  }

  // DRAG & DROP

  onDragStart(event: DragEvent, target: EventTarget | null): void {

    if (!(target instanceof HTMLTableCellElement)) return;

    // title: "fullName"
    if (target.dataset['key'] === '2') {
      event.preventDefault();
      return;
    }

    this.dragIndex = this.dragAndDropService.getVisualIndex(target);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, target: EventTarget | null): void {
    event.preventDefault();

    if (!(target instanceof HTMLTableCellElement)) {
      return;
    }

    const dropIndex = this.dragAndDropService.getVisualIndex(target);

    if (
      this.dragIndex < 0 ||
      dropIndex < 0 ||
      this.dragIndex === dropIndex
    ) {
      this.dragIndex = -1;
      return;
    }

    const columns = [...this.columns];

    const fromIndex = columns.findIndex(
      (_, index) => index === this.dragIndex
    );

    const toIndex = columns.findIndex(
      (_, index) => index === dropIndex
    );

    if (fromIndex < 0 || toIndex < 0) {
      this.dragIndex = -1;
      return;
    }

    const [movedColumn] = columns.splice(fromIndex, 1);
    columns.splice(toIndex, 0, movedColumn);

    this.columns = columns;
    this.dragIndex = -1;
  }

  onResizeStart(event: MouseEvent, target: EventTarget | null): void {
    event.preventDefault();
    event.stopPropagation();

    if (!(target instanceof HTMLElement)) return;

    const resizer = target.closest('.resizer') as HTMLElement | null;
    const th = resizer?.closest('th');
    const table = th?.closest('table');

    if (!resizer || !th || !table) return;

    const startX = event.pageX;
    const startWidth = th.offsetWidth;

    const allThs = Array.from(
      table.querySelectorAll<HTMLElement>('th')
    );

    const allTrs = Array.from(
      table.querySelectorAll<HTMLTableRowElement>('tr')
    );

    const onMouseMove = (moveEvent: MouseEvent) => {
      this.columnResizeService.resizeColumn(
        moveEvent,
        startX,
        startWidth,
        th,
        allThs,
        allTrs
      );
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}

