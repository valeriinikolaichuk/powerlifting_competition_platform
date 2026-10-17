import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import { PgliteService } from '../../../../database/services/pglite.service';

@Injectable({
  providedIn: 'root',
})
export class AthleteTableOptionsService {

  private pg!: PGlite;
    
  constructor(
    private readonly pgliteService: PgliteService,
  ) {
    this.pg = this.pgliteService.database;
  }

  async getWeightClasses(
    federationCategoryId: string
  ): Promise<{ id: string; name: string }[]> {

    const result = await this.pg.query<{
      id: string;
      name: string;
    }>(
      `
        SELECT id, name
        FROM weight_classes
        WHERE weight_class_group = (
          SELECT weight_class_group
          FROM federation_categories
          WHERE id = $1
        )
        ORDER BY weight_class
      `,
      [federationCategoryId],
    );

    return result.rows;  
  }
}
