import type { AthleteSortType } from "../types/sorting.types";

export interface AthleteTableColumn {
  index: number;
  key: number;
  title: string;
  translationScope: string;
  width: number | null;
  left: number | null;
  sortType: AthleteSortType;
  hidden: boolean;
  discipline: string | null;
  indexAttr: string | null;
  draggable: boolean;
  field: string | null;
  editor: string;
  cancelSorting: boolean;
}