import { AthleteCompetitionRow } from "./athlete-competition-row.interface";

export interface AthleteChange {

    operation: 'INSERT' | 'UPDATE';
    
    data: AthleteCompetitionRow;
}
