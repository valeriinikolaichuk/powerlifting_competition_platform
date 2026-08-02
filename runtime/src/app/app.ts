import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
}
