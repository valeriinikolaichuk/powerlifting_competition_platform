import { Component, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginFormComponent } from '../../auth/components/login-form/login-form.component';
import { InfoPopupComponent } from '../../popup/components/info-popups/info-popup.component';
import { AboutContentComponent } from '../../popup/components/info-popups/about-content/about-content.component';
import { PopupService } from '../../popup/services/popup.service';
import { TranslationService } from '../../i18n/services/translation.service';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [
    LoginFormComponent, 
    TranslatePipe, 
    CommonModule,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  
  AboutContentComponent: Type<any> = AboutContentComponent;

  constructor(
    public popup: PopupService, 
    public tService: TranslationService
  ) {}

  ngOnInit() {
    this.tService.load('pages/home');
  }

  setLang(lang: 'en' | 'uk' | 'pl') {
    this.tService.setLang(lang);
  }

  openInfoPopup(content: Type<any>) {
    this.popup.open(InfoPopupComponent, {
      content
    });
  }
}
