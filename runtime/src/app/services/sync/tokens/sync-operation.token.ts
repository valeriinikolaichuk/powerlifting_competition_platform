import { InjectionToken } from '@angular/core';

import { SyncOperationInterface } from '../../../sync/services/sync-operations/sync-operation.interface';

export const SYNC_OPERATIONS = 
    new InjectionToken<SyncOperationInterface[]>('SYNC_OPERATIONS');