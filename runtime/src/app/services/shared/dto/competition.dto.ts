export interface CompetitionAgeGroup {
  id: string;
  name: string;
  sex: string;
  federation_category_id: string;
}

export interface Competition {

  id: string;
  competition_name: string;
  start_date: string;
  end_date: string;
  competition_level: string;
  type: string;
  division_name: string;
  city: string;
  country: string;
  federation_id: string;
  federation_code: string;
  age_groups: CompetitionAgeGroup[];
}