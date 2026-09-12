import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { SyncOperationFactoryService } from './sync-operations/sync-operation-factory.service';

@Injectable()
export class SyncProcessorService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly syncOperationFactory: SyncOperationFactoryService,
    ) {}

    @Interval(1000)
    async processPending(): Promise<void> {

        const items = await this.prisma.syncInbox.findMany({
            where: {
                processed_at: null,
            },
            orderBy: {
                received_at: 'asc',
            },
        });

        for (const item of items) {

            try {

                const operation = this.syncOperationFactory.create(
                    item.operation_id
                );

                await operation.execute({
                    id: item.id,
                    sourceId: item.source_id,
                    operationId: item.operation_id,
                    recordId: item.record_id,
                    payload: item.payload,
                });

                await this.prisma.syncInbox.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        processed_at: new Date(),
                    },
                });

            } catch (error) {

                console.error(
                    `Failed to process sync operation ${item.operation_id}:`,
                    error,
                );
            }
        }
    }
}
