import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RuntimeSessionService } from './session/services/runtime-session.service';
import { PopupComponent } from './popup/components/popup.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    PopupComponent, 
  ],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('runtime');

  constructor(
    private runtimeSession: RuntimeSessionService,
    private router: Router
  ) {}

  async ngOnInit() {

    const wasIncorrectShutdown = await this.runtimeSession.initialize();

    if (wasIncorrectShutdown) {
      await this.router.navigate(['/']);
    }

    this.runtimeSession.startHeartbeat();
    this.runtimeSession.startWakeUpListener();
  }
}
