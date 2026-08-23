import { Injectable } from '@angular/core';
import { PgliteService } from './pglite.service';
import { PGlite } from '@electric-sql/pglite';

import { USER_TABLES } from '#shared-sql';

@Injectable({
  providedIn: 'root',
})
export class SyncService {

  private pg!: PGlite;

  constructor(
    private readonly pgliteService: PgliteService,
  ){}
  
  async initialize(): Promise<void> {

    await this.pgliteService.initialize();

    await this.handleDataSync();
/*
    const hasData = await this.hasData();

    if (!hasData) {
        await this.initialSync();
        return;
    }

    await this.syncPendingQueues();

    const changes = await this.syncWithServer();

    await this.applyServerChanges(changes);
    */
  }

  private async handleDataSync(): Promise<void> {

    if (!navigator.onLine) {
      console.log('Offline mode. Working with the current copy of the database in the browser.');
      return;
    }

    try {
      console.log('Full synchronization started...');


    // КРОК 1: Збираємо та відправляємо локальну чергу змін (якщо вона є)
/*
    const clientChanges: any = {};
    for (const table of this.USER_TABLES) {
      const result = await this.pg.query(`SELECT * FROM ${table} WHERE sync_status = 'pending'`);
      if (result.rows.length > 0) {
        clientChanges[table] = result.rows;
      }
    }
*/
    // Шлемо чергу на сервер. Сервер оновить базу у себе.
    // Якщо черга порожня, сервер просто проігнорує цей блок у себе на бекенді.
//    const response = await this.http.post('/api/sync', { userId: 123, changes: clientChanges }).toPromise();

//    if (response.success) {
      
      // КРОК 2: Повне очищення таблиць
      // Нам байдуже, що там було. Ми просто витираємо все, включаючи те, що було видалено на інших пристроях.
      for (const table of USER_TABLES) {
        await this.pg.query(`TRUNCATE TABLE ${table} CASCADE;`);
      }

      // КРОК 3: Запис актуальних даних з чистого аркуша
      // Сервер у response.freshUserData присилає повний актуальний зріз даних користувача

      for (const [table, rows] of Object.entries(response.freshUserData)) {
        for (const row of rows as any[]) {
          await this.insertRowGeneric(table, row);
        }
      }
      console.log('Локальна база PGlite ідеально синхронізована з сервером!');
//    }
  } catch (err) {
    console.error('Помилка мережі під час синхронізації. Данні в безпеці, спробуємо наступного разу:', err);
  }




  }
}
