import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

@Injectable({
  providedIn: 'root',
})
export class PgliteService {

  private pg!: PGlite;

  private initialized = false;

  private readonly migrationFiles = [
    'assets/migrations/001_create_federations_table.sql',
    'assets/migrations/002_create_age_groups.sql',
    'assets/migrations/003_create_users_table.sql',
    'assets/migrations/004_create_weight_classes.sql',
    'assets/migrations/005_create_federation_categories.sql',
    'assets/migrations/006_create_countries_table.sql',
    'assets/migrations/007_create_regions_table.sql',
    'assets/migrations/008_create_cities_table.sql',
    'assets/migrations/009_create_organizations_table.sql',
    'assets/migrations/010_create_athletes_table.sql',
    'assets/migrations/011_create_sport_officials_table.sql',
    'assets/migrations/012_create_referee_categories_table.sql',
    'assets/migrations/013_create_referee_roles_table.sql',
    'assets/migrations/014_create_user_federations_table.sql',
    'assets/migrations/015_create_participants_table.sql',
    'assets/migrations/016_create_competitions_table.sql',
    'assets/migrations/017_create_competition_age_groups_table.sql',
    'assets/migrations/018_create_referee_competition_table.sql',
    'assets/migrations/019_create_nomination_status_table.sql',
    'assets/migrations/020_create_competition_sessions_table.sql',
    'assets/migrations/021_create_groups_in_session_table.sql',
    'assets/migrations/022_create_weight_classes_in_group_table.sql',
    'assets/migrations/023_create_referee_competition_roles_table.sql',
    'assets/migrations/024_create_athlete_registrations_table.sql',
    'assets/migrations/025_create_competition_organizations_table.sql',
    'assets/migrations/026_create_athlete_lifts_table.sql',
    'assets/migrations/027_create_competition_results_table.sql',
    'assets/migrations/028_create_organization_results_table.sql',
    'assets/migrations/029_create_device_status_table.sql',
    'assets/migrations/030_create_global_state_table.sql',
    'assets/migrations/031_create_referee_nominations_table.sql',
    'assets/migrations/032_create_athlete_nominations_table.sql',
    'assets/migrations/033_create_coefficients_table.sql',
    'assets/migrations/034_create_federation_coefficients_table.sql',
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

    const appliedMigrations = new Set(
      appliedResult.rows.map(r => r.name)
    );

    for (const filePath of this.migrationFiles) {

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
