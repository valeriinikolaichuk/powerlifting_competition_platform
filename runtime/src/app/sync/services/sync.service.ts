import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { 
  TABLE_USERS, 
  STATIC_REFERENCE_TABLES, 
  ADMIN_REFERENCE_TABLES, 
  USER_REFERENCE_TABLES, 
  USER_REFERENCE_FEDERATIONS, 
  COMPETITION_TABLES, 
  COMPETITION_SESSION_TABLES, 
  COMPETITION_GROUP_TABLES, 
  CREATED_BY_USER_TABLES, 
  COMPETITION_RUNTIME_TABLES, 
  ORGANIZATION_RESULT_TABLES, 
} from '#shared-sql';

import { PgliteService } from '../../database/services/pglite.service';
import { SyncQueueService } from './sync-queue.service';
import { SnapshotDto } from '../dto/snapshot.dto';

@Injectable({
  providedIn: 'root',
})
export class SyncService {

  private pg!: PGlite;

  private tables = [
    ...TABLE_USERS, 
    ...STATIC_REFERENCE_TABLES, 
    ...ADMIN_REFERENCE_TABLES, 
    ...USER_REFERENCE_TABLES, 
    ...USER_REFERENCE_FEDERATIONS, 
    ...COMPETITION_TABLES, 
    ...COMPETITION_SESSION_TABLES, 
    ...COMPETITION_GROUP_TABLES, 
    ...CREATED_BY_USER_TABLES, 
    ...COMPETITION_RUNTIME_TABLES, 
    ...ORGANIZATION_RESULT_TABLES,
  ];

  constructor(
    private readonly pgliteService: PgliteService,
    private readonly syncQueueService: SyncQueueService,
    private readonly http: HttpClient,
  ){}

  async initialize(): Promise<void> {

    await this.pgliteService.initialize();

    this.pg = this.pgliteService.database;

    console.log('Queue synchronization started...');

    await this.syncQueueService.sync();

    console.log('Queue synchronizated');

    const snapshot = await this.getSnapshot();

    if (snapshot){
      await this.refreshDatabase(snapshot);
    }
  }

  private async getSnapshot(): Promise<SnapshotDto> {

    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('lang')?.toUpperCase() ?? '';

    const params = new HttpParams().set('language', language);

    return await firstValueFrom(
        this.http.get<SnapshotDto>(
            '/api/sync/snapshot',
            { params }
        )
    );
  }

  private async refreshDatabase(
    dto: SnapshotDto
  ): Promise<void> {

    console.log('Database synchronization started...');

    try {

      await this.pg.query('BEGIN');

      for (const table of this.tables) {

        await this.pg.query(
          `TRUNCATE TABLE ${table} CASCADE;`
        );
      }

      await this.syncWithServer(dto);

      await this.pg.query('COMMIT');

      console.log('Database synchronization completed successfully.');

    } catch (error) {

        await this.pg.query('ROLLBACK');

        console.error('Database synchronization failed:', error);

        throw error;
    }
  }

  async syncWithServer(
    dto: SnapshotDto
  ): Promise<void> {

    for (const table of this.tables) {

      const rows = dto[table];

      if (!rows || rows.length === 0) {
        continue;
      }

      try {
        for (const row of rows) {

          const columns = Object.keys(row);
          const values = Object.values(row);

          const placeholders = columns
            .map((_, index) => `$${index + 1}`)
            .join(', ');

          await this.pg.query(
            `
            INSERT INTO ${table} (${columns.join(', ')})
            VALUES (${placeholders})
            `,
            values,
          );
        }

        console.log(`Table "${table}" synchronized: ${rows.length} records.`);

      } catch (error) {

        console.error(`Failed to synchronize table "${table}".`, error);

        throw error;
      }
    }
  }
}
