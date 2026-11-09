import { Component, OnChanges, SimpleChanges, Input, ViewChild } from '@angular/core';
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
import type { AthleteCompetitionRow } from '#shared-sql';
import type { AthleteCellValue } from '#shared-sql';

import { AthleteRegistrationService } from '../../../../services/core/athlete-registration.service';
import type { AthleteChange } from '#shared-sql';

import { SortingService } from '../services/sorting.service';
import type { SortType, SortDirection } from '../types/sorting.types';
import { DragAndDropService } from '../services/drag-and-drop.service';
import { ColumnResizeService } from '../services/column-resize.service';

import { AthleteInputRowComponent } from './athlete-input-row.component/athlete-input-row.component';

@Component({
  selector: 'app-nomination-table',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    TranslatePipe,
    AthleteInputRowComponent,
  ],
  templateUrl: './nomination-table.html',
  styleUrls: [
    '../styles/table.css',
  ],
})
export class NominationTable implements OnChanges {

  form!: FormGroup;                           // CREATE
  editForms = new Map<string, FormGroup>();   // EDIT

  @Input() competition!: Competition;
  @Input() athletes: AthleteCompetitionRow[] = [];
  @Input() weightClasses: { id: string; name: string }[] = [];
  @Input() editable = true;

  columns: AthleteTableColumn[] = NOMINATION_COLUMNS.map(column => ({ ...column }));
  competitionColspan = 0;
  infoColspan = 0;
  referenceColspan = 0;
  diciplineColspan = 0;

  private originalAthletes: AthleteCompetitionRow[] = [];

  newAthlete: Partial<AthleteCompetitionRow> = {};
  editedAthletes: AthleteCompetitionRow[] = [];
  editingAthleteIds: string[] = [];

  private sortState: {
    field: string;
    type: SortType;
    direction: SortDirection;
  } | null = null;

  private dragIndex = -1;

  @ViewChild('athleteInputRow')
  athleteInputRow!: AthleteInputRowComponent;

  constructor(
    private readonly fb: FormBuilder,
    public tService: TranslationService,
    private readonly columnFactoryService: ColumnFactoryService,
    private readonly athleteTableOptionsService: AthleteTableOptionsService,
    private readonly athleteRegistrationService: AthleteRegistrationService,
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
console.log('originalAthletes: ');
console.log(this.originalAthletes);
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

  // NEW ATHLETE

  createEmptyAthlete(): Partial<AthleteCompetitionRow> {
    return {
      id: crypto.randomUUID(),
      athlete_id: null,

      full_name: null,
      birth_day: null,
      birth_month: null,
      birth_year: null,

      titles: null,

      federation_category_id: this.competition.age_groups[0]?.federation_category_id ?? null,
      category_id: null,
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

      trainer_1: null,
      trainer_2: null,
      trainer_3: null,
      trainer_4: null,

      squat_nominated: null,
      bench_press_nominated: null,
      deadlift_nominated: null,
      total_nominated: null,
      status: 'TEAM',
      qualification: 'QUALIFIED',
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

  async addAthlete(): Promise<void> {
    const fullName = String(this.form.get('full_name')?.value ?? '').trim();

    if (!fullName) {
      this.form.get('full_name')?.setErrors({ required: true });
      return;
    }

    let athleteId = this.form.get('athlete_id')?.value;

    if (!athleteId) {
      const exists = await this.athleteInputRow.checkAthlete(fullName);

      if (exists) return;
    }

    const formValue = this.form.getRawValue();

    const selectedAgeGroup = this.competition.age_groups.find(
      ageGroup =>
        ageGroup.federation_category_id === formValue.federation_category_id
    );

    const selectedWeightClass = this.weightClasses.find(
      category => category.id === formValue.category_id
    );

    const athlete = {
      ...this.newAthlete,
      ...this.form.getRawValue(),
      athlete_id: formValue.athlete_id ?? null,
      full_name: fullName,
      age_group: selectedAgeGroup?.name ?? null,
      weight_class: selectedWeightClass?.name ?? null,
    } as AthleteCompetitionRow;

    const changes: AthleteChange[] = [];

    let createAthlete: boolean;

    if (!athlete.athlete_id) {
      athlete.athlete_id = crypto.randomUUID();
      createAthlete = true;
    } else {
      createAthlete = false;
    }

    const competitionSex = this.competition.age_groups[0].sex;
    const sex = competitionSex === 'MEN' ? 'MAN' : 'WOMAN';

    const now = new Date().toISOString();

    changes.push({
      data: athlete as AthleteCompetitionRow,
      sex: sex,
      federation_id: this.competition.federation_id,
      language: localStorage.getItem('lang')?.toUpperCase() ?? 'EN',
      updated_at: now,
      competition_id: this.competition.id,
      createAthlete: createAthlete,
    });

    await this.athleteRegistrationService.create(changes[0]);

    this.athletes = [athlete, ...this.athletes];

console.log('athletes: ');
console.log(this.athletes);

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



const changes: AthleteChange[] = [];

if (this.newAthlete['full_name']?.trim()) {
  changes.push({
    operation: 'INSERT',
    data: this.newAthlete as AthleteCompetitionRow,
  });
}



const changes: AthleteChange[] = [
  ...(this.newAthlete['full_name']?.trim()
    ? [{
        operation: 'INSERT' as const,
        data: this.newAthlete as AthleteCompetitionRow,
      }]
    : []),

  ...this.editedAthletes.map(data => ({
    operation: 'UPDATE' as const,
    data,
  })),
];





const changes: AthleteChange[] = [];

const fullName = String(this.newAthlete['full_name'] ?? '').trim();

if (fullName) {
  changes.push({
    operation: 'INSERT',
    data: {
      ...this.newAthlete,
      full_name: fullName,
    } as AthleteCompetitionRow,
  });
}

changes.push(
  ...this.editedAthletes
    .filter(athlete => String(athlete.full_name ?? '').trim() !== '')
    .map(data => ({
      operation: 'UPDATE' as const,
      data,
    })),
);

*/



  // EDIT ATHLETE

  startEditing(athlete: AthleteCompetitionRow): void {
    if (this.editForms.has(athlete.id)) return;

    const editForm = this.createAthleteForm(athlete);

    this.editForms.set(athlete.id, editForm);
    this.editingAthleteIds.push(athlete.id);
  }

  isEditing(
    athlete: AthleteCompetitionRow
  ): boolean {
    return this.editingAthleteIds.includes(athlete.id);
  }

  getEditForm(
    athleteId: string
  ): FormGroup {
    return this.editForms.get(athleteId)!;
  }

  createAthleteForm(
    athlete: Partial<AthleteCompetitionRow> = {}
  ): FormGroup {
    return this.fb.group({
      id: [athlete.id ?? null],
      athlete_id: [athlete.athlete_id ?? null],
      full_name: [athlete.full_name ?? '', Validators.required],
      birth_day: [athlete.birth_day ?? null],
      birth_month: [athlete.birth_month ?? null],
      birth_year: [athlete.birth_year ?? null],
      federation_category_id: [athlete.federation_category_id ?? null],
      category_id: [athlete.category_id ?? null],
      group_order: [athlete.group_order ?? null],
      lot: [athlete.lot ?? null],
      sport_rank_class: [athlete.sport_rank_class ?? null],
      country: [athlete.country ?? null],
      region: [athlete.region ?? null],
      city: [athlete.city ?? null],
      sport_society_code: [athlete.sport_society_code ?? null],
      club_code: [athlete.club_code ?? null],
      sport_school_code: [athlete.sport_school_code ?? null],
      university_code: [athlete.university_code ?? null],
      trainer_1: [athlete.trainer_1 ?? null],
      trainer_2: [athlete.trainer_2 ?? null],
      trainer_3: [athlete.trainer_3 ?? null],
      trainer_4: [athlete.trainer_4 ?? null],
      squat_nominated: [athlete.squat_nominated ?? null],
      bench_press_nominated: [athlete.bench_press_nominated ?? null],
      deadlift_nominated: [athlete.deadlift_nominated ?? null],
      total_nominated: [athlete.total_nominated ?? null],
      status: [athlete.status ?? null],
      qualification: [athlete.qualification ?? null],
      titles: [athlete.titles ?? null],
    });
  }






/*
  saveEditedAthlete(): void {
    if (!this.editingAthleteId) {
      return;
    }

    const athlete = this.athletes.find(
      a => a.id === this.editingAthleteId
    );

    if (!athlete) {
      return;
    }

    const updatedAthlete = {
      ...athlete,
      ...this.form.getRawValue(),
    } as AthleteCompetitionRow;

    this.athletes = this.athletes.map(a =>
      a.id === updatedAthlete.id ? updatedAthlete : a
    );

    const index = this.editedAthletes.findIndex(
      a => a.id === updatedAthlete.id
    );

    if (index === -1) {
      this.editedAthletes.push(updatedAthlete);
    } else {
      this.editedAthletes[index] = updatedAthlete;
    }

    this.editingAthleteId = null;
    this.resetNewAthlete();
  }

*/



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

