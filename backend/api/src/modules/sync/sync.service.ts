import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { USER_TABLES } from '#shared-sql';

@Injectable()
export class SyncService {

    constructor(
        private readonly prisma: PrismaService
    ) {}

    async processSync(
        userId: string, 
//        userTables: string[], 
        changes: any,
    ) {
        try {
            return await this.prisma.$transaction(async (tx) => {

                // КРОК 1: Обробка черги змін з Angular (Push)
/*                if (changes && Object.keys(changes).length > 0) {
                
                // Тимчасово вимикаємо перевірку Foreign Keys для цієї транзакції через ваш Prisma-клієнт
                await tx.$executeRawUnsafe('SET session_replication_role = "replica";');

                for (const [tableName, rows] of Object.entries(changes)) {
                    for (const row of rows as any[]) {
                    // Видаляємо сервісний статус Angular, на сервері він не потрібен
                    delete row.sync_status;

                    const columns = Object.keys(row);
                    const values = Object.values(row);
                    
                    // Створюємо плейсхолдери ($1, $2, $3...) для безпечного SQL
                    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
                    
                    // Налаштовуємо ON CONFLICT для перезапису застарілих черг
                    const updateStr = columns.map(col => `"${col}" = EXCLUDED."${col}"`).join(', ');
                    const escapedColumns = columns.map(col => `"${col}"`).join(', ');

                    const insertQuery = `
                        INSERT INTO "${tableName}" (${escapedColumns}) 
                        VALUES (${placeholders})
                        ON CONFLICT (id) 
                        DO UPDATE SET ${updateStr};
                    `;

                    // Виконуємо запит через метод вашої Prisma
                    await tx.$executeRawUnsafe(insertQuery, ...values);
                    }
                }

                // Повертаємо перевірку зв'язків назад
                await tx.$executeRawUnsafe('SET session_replication_role = "origin";');
                }
*/
                // КРОК 2: Збір актуальних даних (Pull)

                const freshUserData: any = {};
/*
                for (const tableName of USER_TABLES) {

                    const selectQuery = `SELECT * FROM "${tableName}" WHERE "${idColumn}" = $1`;
                    
                    const result = await tx.$queryRawUnsafe<any[]>(selectQuery, userId);
                    
                    freshUserData[tableName] = result;
                }
*/
                return {
                    success: true,
                    freshUserData,
                };
            });
        } catch (error: any) {
            throw new InternalServerErrorException(`Sync failed: ${error.message}`);
        }
    }
}
