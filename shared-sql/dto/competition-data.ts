export interface CompetitionData {

    id: string;
    name: string;
    country: string;
    city: string;
    language: string;
    startDate: string;
    endDate: string;
    level: string;
    type: string;
    division: string;
    federationCategoryIds: string[];
    updated_at: string;
}

export interface UpdateCompetitionData {

    id: string;
    name: string;
    country: string;
    city: string;
    startDate: string;
    endDate: string;
    language: string;
    updated_at: string;
}

export interface ArchiveCompetitionData {
    updated_at: string;
}