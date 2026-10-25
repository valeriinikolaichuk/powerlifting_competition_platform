import { Injectable } from '@angular/core';

import { SuggestionService } from '../suggestion.service';
import { AutocompleteStrategy, AutocompleteContext } from './autocomplete-strategy.interface';

@Injectable({
  providedIn: 'root',
})
export class CityAutocompleteStrategy implements AutocompleteStrategy {
  
  constructor(
    private readonly suggestionService: SuggestionService,
  ) {}

  async getSuggestion(
    value: string,
    context?: AutocompleteContext,
  ): Promise<string | null> {

    const regionName = context?.regionName ?? '';

    return this.suggestionService.getCityByRegionSuggestion(
      value,
      regionName,
    );
  }
}
