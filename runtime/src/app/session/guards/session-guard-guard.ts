import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { RuntimeSessionService } from '../services/runtime-session.service';
import { PopupService } from '../../popup/services/popup.service';
import { SystemPopupComponent } from '../../popup/components/system-popups/system-popup.component';
import { SecondTabContentComponent } from '../../popup/components/system-popups/second-tab-content/second-tab-content.component';

export const sessionGuard: CanActivateFn = async () => {
  
  const sessionService = inject(RuntimeSessionService);
  const popupService = inject(PopupService);

  if (!(await sessionService.isCurrentTab())) {

      popupService.open(SystemPopupComponent, {
      
        content: SecondTabContentComponent
      
      });
      
      return false;
  }

  return true;
};
