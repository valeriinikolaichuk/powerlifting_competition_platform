import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginFormComponent } from '../../shared/components/login-form/login-form.component';
import { PopupComponent } from "../../popup/popup.component";
import { InfoPopupComponent } from '../../shared/components/popups/info-popup/info-popup.component';

import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { PopupService } from '../../services/popup.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [LoginFormComponent, 
    PopupComponent, 
    TranslatePipe, 
    CommonModule
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(
    public popup: PopupService, 
    public tService: TranslationService
  ) {}

  ngOnInit() {
    this.tService.load('home');
  }

  setLang(lang: 'en' | 'uk' | 'pl') {
    this.tService.setLang(lang);
  }

  openInfoPopup() {
    this.popup.open(InfoPopupComponent);
  }
}
