export interface AthleteTableColumn {
  index: number;
  key: number;
  title: string;
  translationScope: string;
  width: number | null;
  left: number | null;
  sortType: string | null;
  hidden: boolean;
  discipline: string | null;
  indexAttr: string | null;
  draggable: boolean;
  field: string | null;
  editor: string;
  cancelSorting: boolean;
}