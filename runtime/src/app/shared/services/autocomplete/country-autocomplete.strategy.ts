import { Injectable } from '@angular/core';

import { SuggestionService } from '../suggestion.service';
import { AutocompleteStrategy } from './autocomplete-strategy.interface';

@Injectable({
  providedIn: 'root',
})
export class CountryAutocompleteStrategy implements AutocompleteStrategy {
  
  constructor(
    private readonly suggestionService: SuggestionService,
  ) {}

  async getSuggestion(value: string): Promise<string | null> {

    return this.suggestionService.getCountrySuggestion(value);
  }
}
