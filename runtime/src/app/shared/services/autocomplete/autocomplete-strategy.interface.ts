import { OrganizationType } from "../types/organization-type";

export interface AutocompleteStrategy {
  getSuggestion(
    value: string,
    context?: AutocompleteContext,
  ): Promise<string | null>;
}

export interface AutocompleteContext {
  federationId?: string;
  language?: string;
  competitionSex?: string;
  regionName?: string;
  countryName?: string;
  organizationType?: OrganizationType;
}