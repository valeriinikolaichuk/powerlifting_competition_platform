import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColumnResizeService {
  
  resizeColumn(
    event: MouseEvent,
    startX: number,
    startWidth: number,
    resizer: HTMLElement,
    allThs: HTMLElement[],
    allTrs: HTMLTableRowElement[],
  ): void {
    const newWidth = startWidth + (event.pageX - startX);

    resizer.style.width = `${newWidth}px`;

    const index = allThs.indexOf(resizer);

    if (index === -1) {
      return;
    }

    allTrs.forEach(row => {
      const cell = row.children[index] as HTMLElement | undefined;

      if (cell) {
        cell.style.width = `${newWidth}px`;
      }
    });
  }
}
