import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PopupComponent } from './popup/components/popup.component';
import { PgliteService } from './database/services/pglite.service';
import { RuntimeSessionService } from './session/services/runtime-session.service';
import { EntryService } from './services/shared/entry.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PopupComponent, 
  ],
  templateUrl: './app.html'
})
export class App implements OnInit {

  protected readonly title = signal('runtime');

  constructor(
    private readonly pgliteService: PgliteService,
    private runtimeSession: RuntimeSessionService,
    private entryService: EntryService,
  ) {}

  async ngOnInit() {

    await this.pgliteService.initialize();

    await this.runtimeSession.initialize();

    this.runtimeSession.startHeartbeat();
    this.runtimeSession.startWakeUpListener();

    this.entryService.entry();
  }
}
