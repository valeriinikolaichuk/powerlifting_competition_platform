import { AutocompleteField } from "./autocomplete-field.type";
import { OrganizationType } from "../../../../shared/services/types/organization-type";

export const organizationTypes: Partial<
  Record<AutocompleteField, OrganizationType>
> = {
  sport_society_code: 'SPORT_SOCIETY',
  club_code: 'CLUB',
  sport_school_code: 'SPORT_SCHOOL',
  university_code: 'UNIVERSITY',
};