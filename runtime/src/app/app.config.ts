import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { SYNC_OPERATIONS } from './services/sync/tokens/sync-operation.token';
import { CreateCompetitionOperation } from './services/sync/services/sync-operations/create-competition-operation';
import { UpdateCompetitionOperation } from './services/sync/services/sync-operations/update-competition-operation';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
        provide: SYNC_OPERATIONS,
        useClass: CreateCompetitionOperation,
        multi: true,
    },
    {
        provide: SYNC_OPERATIONS,
        useClass: UpdateCompetitionOperation,
        multi: true,
    },
  ]
};
