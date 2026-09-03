import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';
import { PgliteService } from '../../../../database/services/pglite.service';
import { CompetitionData } from '../dto/competitionData';

@Injectable({
  providedIn: 'root',
})
export class CompetitionPopupService {
  
  private pg!: PGlite;

  constructor(
    private readonly pgliteService: PgliteService,
  ) {}

  async initialize(): Promise<void> {
    this.pg = this.pgliteService.database;
  }

  async create(data: CompetitionData): Promise<void> {

    await this.pg.transaction(async (tx) => {

      await tx.query(
        `
        INSERT INTO competitions (
          id,
          name,
          country,
          city,
          start_date,
          end_date,
          division,
          age_group,
          sex,
          type,
          version
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11
        )
        `,
        [
          data.id,
          data.name,
          data.country,
          data.city,
          data.startDate,
          data.endDate,
          data.division,
          data.ageGroup,
          data.sex,
          data.type,
          data.federation,
        ],
      );

      await tx.query(
        `
        INSERT INTO sync_queue (
          source_id,
          operation_id,
          record_id,
          payload,
          created_at
        )
        VALUES ($1, $2, $3, $4, NOW())
        `,
        [
          /* source_id */,
          /* operation_id */,
          JSON.stringify({
            ...data,
          }),
        ],
      );
      
    });
  }
}
