import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { db } from '../../database/database';
import { RuntimeSessionService } from '../services/runtime-session.service';
import { PopupService } from '../../popup/services/popup.service';
import { SystemPopupComponent } from '../../popup/components/system-popups/system-popup.component';
import { SecondTabContentComponent } from '../../popup/components/system-popups/second-tab-content/second-tab-content.component';

export const entryGuard: CanActivateFn = async () => {

  const SESSION_ID = 1;

  const sessionService = inject(RuntimeSessionService);
  const popupService = inject(PopupService);

  const session = await db.table('runtime_session').get(SESSION_ID);

  if (!session) {

    await sessionService.createSession();

    return true;
  }

  if (!(await sessionService.isCurrentTab())) {

      popupService.open(SystemPopupComponent, {
      
        content: SecondTabContentComponent
      
      });
      
      return false;
  }

  return true;
};
