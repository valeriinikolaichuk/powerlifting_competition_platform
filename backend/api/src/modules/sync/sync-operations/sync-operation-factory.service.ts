import { Injectable, Inject } from '@nestjs/common';

import { SYNC_OPERATIONS } from '../sync.tokens';
import { SyncOperationInterface } from './sync-operation.interface';

@Injectable()
export class SyncOperationFactoryService {

    constructor(
        @Inject(SYNC_OPERATIONS)
        private readonly operations: SyncOperationInterface[],
    ) {}

    create(operationId: string): SyncOperationInterface {

        const operation = this.operations.find(
            operation => operation.supports(operationId),
        );

        if (!operation) {
            throw new Error(`Unknown sync operation: ${operationId}`,);
        }

        return operation;
    }
}
