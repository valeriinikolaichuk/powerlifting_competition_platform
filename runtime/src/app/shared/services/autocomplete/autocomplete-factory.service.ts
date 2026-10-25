import { Injectable } from '@angular/core';

import { AutocompleteStrategy } from './autocomplete-strategy.interface';
import { FullnameAutocompleteStrategy } from './fullname-autocomplete.strategy';
import { CountryAutocompleteStrategy } from './country-autocomplete.strategy';
import { RegionAutocompleteStrategy } from './region-autocomplete.strategy';
import { CityAutocompleteStrategy} from './city-autocomplete.strategy';
import { OrganizationAutocompleteStrategy } from './organization-autocomplete.strategy';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteFactoryService {

  constructor(
    private readonly fullnameStrategy: FullnameAutocompleteStrategy,
    private readonly countryStrategy: CountryAutocompleteStrategy,
    private readonly regionStrategy: RegionAutocompleteStrategy,
    private readonly cityStrategy: CityAutocompleteStrategy,
    private readonly organizationStrategy: OrganizationAutocompleteStrategy,
  ) {}

  getStrategy(field: string): AutocompleteStrategy | null {
    const strategies: Record<string, AutocompleteStrategy> = {
      full_name: this.fullnameStrategy,
      country: this.countryStrategy,
      region: this.regionStrategy,
      city: this.cityStrategy,

      sport_society_code: this.organizationStrategy,
      club_code: this.organizationStrategy,
      sport_school_code: this.organizationStrategy,
      university_code: this.organizationStrategy,
    };

    return strategies[field] ?? null;
  }
}
