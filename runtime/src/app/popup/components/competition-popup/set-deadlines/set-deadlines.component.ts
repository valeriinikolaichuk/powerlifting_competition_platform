import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

import { PopupService } from '../../../services/popup.service';

import { NominationConfigService } from '../../../../services/core/nomination-config.service';
import { NominationOptionsService } from '../services/nomination-options.service';
import { CompetitionOptionsService } from '../services/competition-options.service';

import { Competition } from '../../../../services/shared/dto/competition.dto';
import { AgeGroupOption } from '../dto/competition-options.dtos';

@Component({
  selector: 'app-set-deadlines',
  imports: [
    ReactiveFormsModule,
    TranslatePipe, 
    DatePipe,
  ],
  templateUrl: './set-deadlines.component.html',
  styleUrl: '../autocomplete.css',
})
export class SetDeadlinesComponent {

  competition = input.required<Competition>();
  
  form!: FormGroup;
  ageGroups: AgeGroupOption[] = [];
  preliminaryDays = 60;
  finalDays = 30;

  constructor(
    private readonly fb: FormBuilder,
    public tService: TranslationService,  
    private readonly popup: PopupService, 
    private readonly nominationConfigService: NominationConfigService,
    public competitionOptionsService: CompetitionOptionsService,
    public nominationOptionsService: NominationOptionsService,
  ) {
    this.tService.load('popups/competition-popup');
  }

  async ngOnInit() {

    const competition = this.competition();

    const nominationDates =
        await this.nominationOptionsService.getNominationDates(
            competition.id,
        );

    const startDate = new Date(competition.start_date);

    const preliminaryDate =
        nominationDates?.preliminary_date ??
        this.getDateBefore(startDate, 60);

    const finalDate =
        nominationDates?.final_date ??
        this.getDateBefore(startDate, 30);

    this.form = this.fb.group({
        preliminaryDate: [preliminaryDate],
        finalDate: [finalDate],
    });

    this.updateNominationDays();

    this.form.get('preliminaryDate')?.valueChanges.subscribe(
      (preliminaryDate) => {

        const startDate = new Date(this.competition().start_date);
        const startDateString = this.toDateString(this.competition().start_date);

        if (preliminaryDate && preliminaryDate >= startDateString) {
          this.form.get('preliminaryDate')?.setValue(
            this.getDateBefore(startDate, 1),
            { emitEvent: false },
          );

          preliminaryDate = this.form.get('preliminaryDate')?.value;
        }

        const finalDate = this.form.get('finalDate')?.value;

        if (preliminaryDate && finalDate && preliminaryDate > finalDate) {
          this.form.get('finalDate')?.setValue(preliminaryDate);
        }

        this.updateNominationDays();
      },
    );

    this.form.get('finalDate')?.valueChanges.subscribe(
      (finalDate) => {

        const startDate = new Date(this.competition().start_date);
        const startDateString = this.toDateString(this.competition().start_date);

        if (finalDate && finalDate >= startDateString) {
          this.form.get('finalDate')?.setValue(
            this.getDateBefore(startDate, 1),
            { emitEvent: false },
          );

          finalDate = this.form.get('finalDate')?.value;
        }

        const preliminaryDate = this.form.get('preliminaryDate')?.value;

        if (preliminaryDate && finalDate && finalDate < preliminaryDate) {
          this.form.get('finalDate')?.setValue(preliminaryDate);
        }

        this.updateNominationDays();
      },
    );

    await this.loadAgeGroups();
  }

  // DEADLINES
  private getDateBefore(
    date: Date,
    days: number,
  ): string {

    const result = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    result.setDate(result.getDate() - days);

    const year = result.getFullYear();
    const month = String(result.getMonth() + 1).padStart(2, '0');
    const day = String(result.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private updateNominationDays(): void {

    const competition = this.competition();
    const startDate = competition.start_date;

    const preliminaryDate = this.form.get('preliminaryDate')?.value;
    const finalDate = this.form.get('finalDate')?.value;

    if (startDate && preliminaryDate) {
        this.preliminaryDays = this.getDaysBetween(preliminaryDate, startDate);
    }

    if (startDate && finalDate) {
        this.finalDays = this.getDaysBetween(finalDate, startDate);
    }
  }

  private getDaysBetween(
    nominationDate: string | Date,
    competitionDate: string | Date,
  ): number {

    const nomination = this.toDateParts(nominationDate);
    const competition = this.toDateParts(competitionDate);

    const nominationUtc = Date.UTC(
      nomination.year,
      nomination.month - 1,
      nomination.day,
    );

    const competitionUtc = Date.UTC(
      competition.year,
      competition.month - 1,
      competition.day,
    );

    return Math.max(0, Math.round(
        (competitionUtc - nominationUtc) / (1000 * 60 * 60 * 24),
      ),
    );
  }

  private toDateParts(date: string | Date): {
    year: number;
    month: number;
    day: number;
  } {

    if (date instanceof Date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }

    const [year, month, day] = date.slice(0, 10).split('-').map(Number);

    return { year, month, day, };
  }

  private toDateString(date: Date | string): string {

    if (typeof date === 'string') {
        return date.slice(0, 10);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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

  async setDeadlines() {
    const competition = this.competition();
    
    console.log(competition.id);

    const preliminaryDate = this.form.get('preliminaryDate')?.value;
    const finalDate = this.form.get('finalDate')?.value;

    if (!preliminaryDate || !finalDate) { return; }

    await this.nominationConfigService.setNominationDates(
        competition.id,
        preliminaryDate,
        finalDate,
    );

    this.popup.close();
  }

  close(): void {
    this.popup.close();
  }
}
