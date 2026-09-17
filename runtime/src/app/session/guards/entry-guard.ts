import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { db } from '../../database/database';
import { RuntimeSessionService } from '../services/runtime-session.service';
import { PopupService } from '../../popup/services/popup.service';

export const entryGuard: CanActivateFn = async () => {

  const SESSION_ID = 1;

  const sessionService = inject(RuntimeSessionService);
  const popupService = inject(PopupService);

  await sessionService.initialize();

  const session = await db.table('runtime_session').get(SESSION_ID);

  if (!session) {
    await sessionService.createSession();
  }

  return true;
};
