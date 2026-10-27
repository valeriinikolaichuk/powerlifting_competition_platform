import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragAndDropService {
  
  getVisualIndex(cell: HTMLTableCellElement): number {
    const cells = Array.from(cell.parentElement?.children ?? []);
    let index = 0;

    for (const element of cells) {
      const currentCell = element as HTMLTableCellElement;
      const colspan = currentCell.colSpan || 1;

      if (currentCell === cell) {
        return index;
      }

      index += colspan;
    }

    return -1;
  }

  getCellByVisualIndex(
    row: HTMLTableRowElement,
    visualIndex: number,
  ): HTMLTableCellElement | null {
    let currentIndex = 0;

    for (const element of Array.from(row.children)) {
      const cell = element as HTMLTableCellElement;
      const colspan = cell.colSpan || 1;

      if (
        visualIndex >= currentIndex &&
        visualIndex < currentIndex + colspan
      ) {
        return cell;
      }

      currentIndex += colspan;
    }

    return null;
  }
}
