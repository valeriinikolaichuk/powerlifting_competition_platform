import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FrontendSessionService } from './services/frontend-session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
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
