import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { 
  STATIC_REFERENCE_TABLES, 
  REFERENCE_TABLES, 
  USER_REFERENCE_TABLES, 
  USER_REFERENCE_FEDERATIONS, 
  COMPETITION_TABLES, 
  SESSION_TABLES, 
  GROUP_TABLES, 
  TABLE_USERS, 
  USER_TABLES,  
} from '#shared-sql';

import { PgliteService } from '../../database/services/pglite.service';
import { QueueSyncResult } from '../dto/queue-sync-result';
import { SnapshotDto } from '../dto/snapshot.dto';

@Injectable({
  providedIn: 'root',
})
export class SyncService {

  private pg!: PGlite;

  private tables = [
    ...STATIC_REFERENCE_TABLES, 
    ...REFERENCE_TABLES, 
    ...USER_REFERENCE_TABLES, 
    ...USER_REFERENCE_FEDERATIONS, 
    ...COMPETITION_TABLES, 
    ...SESSION_TABLES, 
    ...GROUP_TABLES, 
    ...TABLE_USERS, 
    ...USER_TABLES, 
  ];

  constructor(
    private readonly pgliteService: PgliteService,
    private readonly http: HttpClient,
  ){}

  async initialize(): Promise<void> {

    await this.pgliteService.initialize();

    this.pg = this.pgliteService.database;

    if (!navigator.onLine) {
      console.log('Offline mode. Working with the current copy of the database in the browser.');
      return;
    }

    await this.handleQueueSync();

    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('lang')?.toUpperCase() ?? '';

    const params = new HttpParams().set('language', language);

    const snapshot = await firstValueFrom(
      this.http.get<SnapshotDto>(
        '/api/sync/snapshot',
        { params }
      )
    );

    if (snapshot){
      await this.refreshDatabase(snapshot);
    }
  }

  private async handleQueueSync(): Promise<void> {
    try {
      console.log('Queue synchronization started...');

      // Pushing local change queue (if any)
      const result = await this.pg.query(`
        SELECT
          id,
          source_id,
          operation_id,
          record_id,
          payload,
          created_at
        FROM sync_queue
        WHERE processed_at IS NULL
        ORDER BY created_at
      `);

      if (result.rows.length > 0) {
        const response = await firstValueFrom(
          this.http.post<QueueSyncResult>(
            '/api/sync',
            {
                changes: result.rows,
            },
          )
        );

        if (response.success) {
          console.log(`Queue synchronized. Received: ${response.received}`);

          await this.pg.query(`
            DELETE FROM sync_queue
            WHERE processed_at IS NULL
          `);
        }
      }

      console.log('Queue synchronizated');
    } catch (err) {
      console.error('Network error while syncing:', err);
    }
  }

  private async refreshDatabase(
    dto: SnapshotDto
  ): Promise<void> {

    try {
      console.log('Database synchronization started...');

      for (const table of this.tables) {

        await this.pg.query(
          `TRUNCATE TABLE ${table} CASCADE;`
        );
      }

      await this.syncWithServer(dto);

      console.log('Database synchronization completed successfully.');

    } catch (error) {

      console.error('Database synchronization failed:', error);

      throw error;
    }
  }

  async syncWithServer(
    dto: SnapshotDto
  ): Promise<void> {

    for (const table of this.tables) {

      const rows = dto.data[table];

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
