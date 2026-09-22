import { Inject, Injectable } from '@angular/core';

import { SyncOperationInterface } from './sync-operation.interface';
import { SYNC_OPERATIONS } from '../../tokens/sync-operation.token';

@Injectable({
  providedIn: 'root',
})
export class SyncOperationFactory {

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
