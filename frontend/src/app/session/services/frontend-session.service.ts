import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { PopupService } from '../../popup/services/popup.service';
import { SecondTabPopupComponent } from '../components/second-tab-popup/second-tab-popup.component';
import { db } from '../../database/database';

@Injectable({
  providedIn: 'root',
})
export class FrontendSessionService implements OnDestroy {

  constructor(
      private readonly popupService: PopupService,
  ) {}

  private readonly SESSION_ID = 1;

  private readonly HEARTBEAT_INTERVAL = 30000;
  private readonly HEARTBEAT_TIMEOUT = 90 * 1000;

  private readonly WAKEUP_CHECK_INTERVAL = 10_000;
  private readonly WAKEUP_TIMEOUT = 120_000;

  private heartbeatSubscription?: Subscription;
  private wakeUpSubscription?: Subscription;

  private lastCheck = Date.now();
  
  async initialize(): Promise<boolean> {
    const session = await db.table('frontend_session').get(this.SESSION_ID);
    
    if (!session) {
      await db.table('frontend_session').add({
        id: this.SESSION_ID,
        login_at: null,
        heartbeat: Date.now()
      });

      return false;
    }

    const expired = Date.now() - session.heartbeat > this.HEARTBEAT_TIMEOUT;

    if (expired) {
      await db.table('frontend_session')
        .update(this.SESSION_ID, {
          login_at: null,
          heartbeat: Date.now()
      });

      return true;
    }

    return false;
  }

  public startHeartbeat(): void {

    if (this.heartbeatSubscription) {
      this.heartbeatSubscription.unsubscribe();
    }

    this.heartbeatSubscription = interval(this.HEARTBEAT_INTERVAL).subscribe(async () => {
    
    if (document.hidden) {
      return; 
    }

    try {
      await db.table('frontend_session').update(this.SESSION_ID, {
          heartbeat: Date.now()
        });
        console.log('--- [Dexie] Heartbeat updated ---');
      } catch (error) {
        console.error('Failed to update heartbeat in Dexie:', error);
      }
    });
  }

  public startWakeUpListener(): void {

    this.wakeUpSubscription?.unsubscribe();
    this.lastCheck = Date.now();

    this.wakeUpSubscription = interval(this.WAKEUP_CHECK_INTERVAL)
      .subscribe(async () => {

        const now = Date.now();

        if (now - this.lastCheck > this.WAKEUP_TIMEOUT) {
          try {
            await this.updateHeartbeat();
            console.log('Computer wake up detected');
          } catch (error) {
            console.error('Wake-up heartbeat failed', error);
          }
        }

        this.lastCheck = now;
      });
  }

  private async updateHeartbeat(): Promise<void> {
    await db.table('frontend_session').update(this.SESSION_ID, {
      heartbeat: Date.now()
    });
  }

  async clearLogin(): Promise<void> {
    await db.table('frontend_session').update(this.SESSION_ID, {
      login_at: null,
      heartbeat: Date.now(),
    });
  }

  async lockLogin(): Promise<boolean> {

    const session = await db.table('frontend_session').get(this.SESSION_ID);

    if (session?.login_at != null) {

      this.popupService.open(SecondTabPopupComponent);

      return false;
    }

    await db.table('frontend_session').update(this.SESSION_ID, {
      login_at: Date.now(),
      heartbeat: Date.now(),
    });

    return true;
  }

  ngOnDestroy(): void {
    this.heartbeatSubscription?.unsubscribe();
    this.wakeUpSubscription?.unsubscribe();
  }
}
