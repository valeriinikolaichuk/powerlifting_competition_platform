import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import { migrationFiles } from './pglite.config';

@Injectable({
  providedIn: 'root',
})
export class PgliteService {

  private pg!: PGlite;

  private initialized = false;

  async initialize(): Promise<void> {

    if (this.initialized) return;

    try {
      this.pg = await PGlite.create('idb://bombingout');

      await this.pg.exec(`
        CREATE TABLE IF NOT EXISTS "__migrations" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT UNIQUE NOT NULL,
          "executed_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await this.runMigrations();

      this.initialized = true;
      console.log('PGlite database successfully initialized.');

      } catch (error) {
        console.error('Failed to initialize PGlite database:', error);
        throw error;
    }
  }

  private async runMigrations(): Promise<void> {

    const appliedResult = await this.pg.query<{ name: string }>(
      'SELECT name FROM __migrations'
    );

    const appliedMigrations = new Set(
      appliedResult.rows.map(r => r.name)
    );

    for (const filePath of migrationFiles) {

      const fileName = filePath.split('/').pop()!;

      if (appliedMigrations.has(fileName)) { continue; }

      console.log(`Applying migration: ${fileName}`);

      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`Failed to load migration "${filePath}". ` + `HTTP ${response.status}`);
      }

      const sqlContent = await response.text();

      await this.pg.transaction(async (tx) => {

        await tx.exec(sqlContent);

        await tx.query(
          'INSERT INTO "__migrations" ("name") VALUES ($1)',
          [fileName]
        );

      });

      console.log(`Migration applied: ${fileName}`);
    }
  }
  
  get database(): PGlite {
    if (!this.initialized) throw new Error('Database not initialized.');

    return this.pg;
  }

  async query<T = any>(
    sql: string,
    params?: any[],
  ) {
    if (!this.initialized) throw new Error('Database not initialized.');
    
    return this.pg.query<T>(sql, params);
  }
}
