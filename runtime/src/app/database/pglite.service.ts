import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

//import migration001 from '/public/assets/migrations/001_init.sql' with { type: 'text' };
//import migration002 from '/public/assets/migrations/002_add_new_table.sql' with { type: 'text' };

@Injectable({
  providedIn: 'root',
})
export class PgliteService {

  private pg!: PGlite;

  private initialized = false;

  private readonly migrationFiles = [
//    { fileName: '001_init.sql', sqlContent: migration001 },
//    { fileName: '002_add_new_table.sql', sqlContent: migration002 },
  ];

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

    const appliedMigrations = new Set(appliedResult.rows.map(r => r.name));

    for (const { fileName, sqlContent } of this.migrationFiles) {

      if (!appliedMigrations.has(fileName)) {

        console.log(`Applying migration: ${fileName}`);

        await this.pg.transaction(async (tx) => {
          await tx.exec(sqlContent);
          await tx.query('INSERT INTO __migrations (name) VALUES ($1)', [fileName]);
        });
      }
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
