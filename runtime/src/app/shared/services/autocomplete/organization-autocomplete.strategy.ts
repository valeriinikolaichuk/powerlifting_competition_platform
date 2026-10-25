import { Injectable } from '@angular/core';

import { SuggestionService } from '../suggestion.service';
import { AutocompleteStrategy, AutocompleteContext } from './autocomplete-strategy.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganizationAutocompleteStrategy implements AutocompleteStrategy {
  
  constructor(
    private readonly suggestionService: SuggestionService,
  ) {}

  async getSuggestion(
    value: string,
    context?: AutocompleteContext,
  ): Promise<string | null> {
    if (!context?.organizationType) {
      return null;
    }

    return this.suggestionService.getOrganizationSuggestion(
      value,
      context.organizationType,
    );
  }
}
