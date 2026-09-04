export interface FederationOption {
    id: string;
    code: string;
}

export const COMPETITION_LEVELS = [
  'INTERNATIONAL',
  'NATIONAL',
  'REGIONAL_OPEN',
  'REGIONAL_ONLY',
  'LOCAL_OPEN',
  'LOCAL_ONLY',
] as const;

export type CompetitionLevel = typeof COMPETITION_LEVELS[number];

export const COMPETITION_TYPES = [
  'POWERLIFT',
  'BENCH_PRESS',
] as const;

export type CompetitionType = typeof COMPETITION_TYPES[number];

export interface DivisionOption {
  division: string;
}