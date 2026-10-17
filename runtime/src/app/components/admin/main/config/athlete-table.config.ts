import { AthleteTableColumn } from '../models/athlete-table-column.interface';

export interface AthleteTableConfig {
  columns: AthleteTableColumn[];
  competitionColspan: number;
  infoColspan: number;
  referenceColspan: number;
  diciplineColspan: number;
}