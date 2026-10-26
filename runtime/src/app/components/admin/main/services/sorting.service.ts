import { Injectable } from '@angular/core';

import { AthleteCompetitionRow } from '../models/athlete-competition-row.interface';
import type { SortType, SortDirection } from '../types/sorting.types';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  
  sort(
    athletes: AthleteCompetitionRow[],
    field: string,
    type: SortType,
    direction: SortDirection,
  ): AthleteCompetitionRow[] {

    return [...athletes].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      let result: number;

      if (type === 'number') {
        result = this.compareNumbers(valueA, valueB);
      } else {
        result = this.compareStrings(valueA, valueB);
      }

      return direction === 'asc' ? result : -result;
    });
  }

  private compareNumbers(
    a: string | number | boolean | null | undefined,
    b: string | number | boolean | null | undefined,
  ): number {

    const numA = a == null || a === '' ? null : Number(a);
    const numB = b == null || b === '' ? null : Number(b);

    if (numA === null && numB === null) return 0;
    if (numA === null) return 1;
    if (numB === null) return -1;

    return numA - numB;
  }

  private compareStrings(
    a: string | number | boolean | null | undefined,
    b: string | number | boolean | null | undefined,
  ): number {

    return String(a ?? '').localeCompare(
      String(b ?? ''),
      undefined,
      {
        numeric: true,
        sensitivity: 'base',
      },
    );
  }
}
