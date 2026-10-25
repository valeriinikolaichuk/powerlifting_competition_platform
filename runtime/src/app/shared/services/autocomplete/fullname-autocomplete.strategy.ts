import { Injectable } from '@angular/core';

import { SuggestionService } from '../suggestion.service';
import { AutocompleteStrategy, AutocompleteContext } from './autocomplete-strategy.interface';

@Injectable({
  providedIn: 'root',
})
export class FullnameAutocompleteStrategy implements AutocompleteStrategy {
  
  constructor(
    private readonly suggestionService: SuggestionService,
  ) {}

  async getSuggestion(
    value: string,
    context?: AutocompleteContext,
  ): Promise<string | null> {

    if (
      !context?.federationId ||
      !context.language ||
      !context.competitionSex
    ) {
      return null;
    }

    let sex;

    if (context.competitionSex === 'MEN') {
      sex = 'MAN';
    } else {
      sex = 'WOMAN';
    }

    return this.suggestionService.getAthleteSuggestion(
      value,
      context.federationId, 
      context.language, 
      sex,
    );
  }
}
