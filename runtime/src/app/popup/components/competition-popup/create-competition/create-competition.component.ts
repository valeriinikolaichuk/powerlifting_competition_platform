import { Component, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, } from '@angular/forms';

import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

import { PopupService } from '../../../services/popup.service';
import { CompetitionPopupService } from '../services/competition-popup.service';
import { CompetitionOptionsService } from '../services/competition-options.service';

import { 
  FederationOption, 
  COMPETITION_LEVELS, 
  COMPETITION_TYPES, 
  DivisionOption, 
  SEXES, 
  AgeGroupOption,
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

  readonly types = COMPETITION_TYPES;
  readonly sexes = SEXES;
  readonly levels = computed(() => {
    const lang = this.tService.lang();

    if (lang === 'en') { return COMPETITION_LEVELS; }

    return COMPETITION_LEVELS.filter(
      level => level !== 'INTERNATIONAL'
    );
  });

  form;
  isLoading = true;

  federations: FederationOption[] = [];
  divisions: DivisionOption[] = [];
  ageGroups: AgeGroupOption[] = [];
  selectedAgeGroups: string[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public tService: TranslationService,  
    private readonly popup: PopupService, 
    private readonly competitionPopupService: CompetitionPopupService, 
    private readonly competitionOptionsService: CompetitionOptionsService,
  ) {
    const today = new Date().toISOString().slice(0, 10);

    this.form = this.fb.group({
      competitionName: [''],
      country: [''],
      city: [''],
      startDate: [today],
      endDate: [today],
      federation: [''],
      level: [this.levels()[0]],
      type: [this.types[0]],
      division: [''],
      sex: [this.sexes[0]],
      ageGroup: this.fb.control<string[]>([]),
    });

    this.tService.load('popups/competition-popup');

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

    this.form.get('federation')?.valueChanges.subscribe(
      async (federationId) => {

        this.form.get('division')?.setValue('');

        if (!federationId) {
          this.divisions = [];
          return;
        }

        this.divisions = await this.competitionOptionsService.getDivisions(federationId);

        if (this.divisions.length > 0) {
          this.form.get('division')?.setValue(this.divisions[0].division);
        }
      },
    );

    this.form.get('federation')?.valueChanges.subscribe(
      async () => { await this.loadAgeGroups(); },
    );

    this.form.get('sex')?.valueChanges.subscribe(
      async () => { await this.loadAgeGroups(); },
    );
  }

  async ngOnInit(): Promise<void> {

    this.federations = await this.competitionOptionsService.getFederations();
    this.form.get('federation')?.setValue(this.federations[0].id);
  }

  async loadAgeGroups(): Promise<void> {

    const federationId = this.form.get('federation')?.value;
    const sex = this.form.get('sex')?.value;

    if (!federationId || !sex) {
      this.ageGroups = [];
      return;
    }

    this.ageGroups = await this.competitionOptionsService.getAgeGroups(
      federationId,
      sex,
    );

    this.isLoading = false;
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

  isAgeGroupSelected(ageGroupId: string): boolean {
    return this.form.get('ageGroup')?.value?.includes(ageGroupId) ?? false;
  }

  onAgeGroupChange(
    ageGroupId: string,
    event: Event,
  ): void {

    const control = this.form.get('ageGroup');

    const selected = control?.value ?? [];

    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      control?.setValue([
        ...selected,
        ageGroupId,
      ]);
    } else {
      control?.setValue(
        selected.filter(
          (id: string) => id !== ageGroupId
        )
      );
    }
  }

  async create(): Promise<void> {

    const value = this.form.getRawValue();

    const isValid = this.validateForm(
      value.competitionName,
      value.country,
      value.city,
      value.ageGroup,
    );

    if (!isValid) {
      return;
    }

    const id = crypto.randomUUID();
    const language = localStorage.getItem('lang');
    const now = new Date().toISOString();

    await this.competitionPopupService.create({
      id: id,
      name: value.competitionName!,
      country: value.country!,
      city: value.city!,
      language: language!,
      startDate: value.startDate!,
      endDate: value.endDate!,
      level: value.level!,
      type: value.type!,
      division: value.division!,
      federationCategoryIds: value.ageGroup ?? [],
      updated_at: now,
    });
  }

  validateForm(
    competitionName: string | null,
    country: string | null,
    city: string | null,
    ageGroup: string[] | null,
  ): boolean {
    const lang = this.tService.lang();

    if (!competitionName) {
      alert(this.tService.t(
        'popups/competition-popup',
        'validate_competition_name'
      ));

      return false;
    }

    if (!country) {
      alert(this.tService.t(
        'popups/competition-popup',
        'validate_country'
      ));

      return false;
    }

    if (!city) {
      alert(this.tService.t(
        'popups/competition-popup',
        'validate_city'
      ));
      
      return false;
    }

    if (!ageGroup || ageGroup.length === 0) {
      alert(this.tService.t(
        'popups/competition-popup',
        'validate_age_group'
      ));
      return false;
    }

    return true;
  }

  close(): void {
    this.popup.close();
  }
}
