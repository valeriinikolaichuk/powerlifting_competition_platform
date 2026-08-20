import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PowerliftingChatService {
  
  private isChatOpened$ = new BehaviorSubject<boolean>(false);
  
  chatState$ = this.isChatOpened$.asObservable();

  toggleChat() {
    this.isChatOpened$.next(
      !this.isChatOpened$.value
    );
  }

  openChat() {
    this.isChatOpened$.next(true);
  }
}
