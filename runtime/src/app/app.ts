import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RuntimeSessionService } from './session/services/runtime-session.service';
import { PopupComponent } from './popup/components/popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    PopupComponent, 
  ],
  templateUrl: './app.html'
})
export class App implements OnInit {
  protected readonly title = signal('runtime');

  constructor(
    private runtimeSession: RuntimeSessionService,
  ) {}

  async ngOnInit() {

    await this.runtimeSession.initialize();

    this.runtimeSession.startHeartbeat();
    this.runtimeSession.startWakeUpListener();
  }
}
