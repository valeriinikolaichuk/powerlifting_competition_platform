import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

@Injectable({
  providedIn: 'root',
})
export class PgliteService {

  private pg!: PGlite;

  private initialized = false;

  async initialize(): Promise<void> {

    if (this.initialized) {
      return;
    }

    const result = await PGlite.create('idb://bombingout');

    this.pg = result;

    if (result['isNew']) {
      await this.createDatabase();
    }

    this.initialized = true;
  }

  private async createDatabase(): Promise<void> {

    const response = await fetch('/database/runtime.sql');

    const sql = await response.text();

    await this.pg.exec(sql);
  }

  get database(): PGlite {
    return this.pg;
  }

  async query<T = any>(
    sql: string,
    params?: any[],
  ) {
    return this.pg.query<T>(sql, params);
  }
}
