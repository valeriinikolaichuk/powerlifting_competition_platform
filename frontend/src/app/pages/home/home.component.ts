import { Component } from '@angular/core';
import { LoginFormComponent } from '../../shared/components/login-form/login-form.component';
import { PopupService } from '../../services/popup.service';
import { PopupComponent } from "../../popup/popup.component";

import { InfoPopupComponent } from '../../shared/components/popups/info-popup/info-popup.component';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [LoginFormComponent, PopupComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {

  constructor(public popup: PopupService) {}

  openInfoPopup() {
    this.popup.open(InfoPopupComponent);
  }
}
