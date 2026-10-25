import { Injectable } from '@angular/core';

import { AthleteTableColumn } from '../models/athlete-table-column.interface';
import { ColumnContext } from '../config/column-context';
import { AthleteTableConfig } from '../config/athlete-table.config';
import { COLUMN_PIPELINES } from '../utils/column.utils';

import { ColspanFactoryService } from './colspan-factory.service';
import { ColspanConfigDto, HiddenColspanDto } from '../config/colspan.dto';
import { COLSPAN_PIPELINES } from '../utils/colspan.units';

@Injectable({
  providedIn: 'root',
})
export class ColumnFactoryService {

  constructor(
    private readonly colspanFactory: ColspanFactoryService,
  ) {}
    
  public createTableConfig(
    columns: AthleteTableColumn[],
    context: ColumnContext,
    colspanConfig: {
      competitionColspan: number,
      infoColspan: number,
      referenceColspan: number,
      diciplineColspan: number,
    },
  ): AthleteTableConfig {

    const configuredColumns = columns.map(column =>
      this.hideColumnFactory(column, context)
    );

    const colspan = this.colspanFactory.create<
      ColumnContext,
      ColspanConfigDto,
      HiddenColspanDto
    >(
      context,
      colspanConfig,
      COLSPAN_PIPELINES,
    );

    return {
      columns: configuredColumns,
      ...colspan,
    };
  }

  private hideColumnFactory(
    column: AthleteTableColumn, 
    context: ColumnContext
  ): AthleteTableColumn {

    let targetHidden: boolean | null = null;

    for (const pipeline of COLUMN_PIPELINES) {

      const result = pipeline(column, context);

      if (result !== null) {
        targetHidden = result;
      }
    }

    return {
      ...column,
      hidden: targetHidden !== null ? targetHidden : column.hidden
    };
  }
}

