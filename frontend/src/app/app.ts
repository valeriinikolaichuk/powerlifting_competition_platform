import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FrontendSessionService } from './session/services/frontend-session.service';
import { PopupComponent } from './popup/components/popup.component';
import { PowerliftingChatComponent } from './chat/components/powerlifting-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    PopupComponent, 
    PowerliftingChatComponent
  ],
  templateUrl: './app.html'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  constructor(
    private frontendSession: FrontendSessionService,
    private router: Router
  ) {}

  async ngOnInit() {

    const wasIncorrectShutdown = await this.frontendSession.initialize();

    if (wasIncorrectShutdown) {
      await this.router.navigate(['/']);
    }

    this.frontendSession.startHeartbeat();
    this.frontendSession.startWakeUpListener();
  }
}
