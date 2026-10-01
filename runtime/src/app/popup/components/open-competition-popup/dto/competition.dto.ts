export interface CompetitionAgeGroup {
  id: string;
  name: string;
  sex: string;
}

export interface Competition {

  id: string;
  start_date: string;
  end_date: string;
  competition_level: string;
  type: string;
  division_name: string;
  city: string;
  country: string;
  federation_code: string;
  age_groups: CompetitionAgeGroup[];
}