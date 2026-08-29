import { Component, OnInit, Type, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginFormComponent } from '../../auth/components/login-form.component';

import { InfoPopupComponent } from '../../popup/components/info-popups/info-popup.component';
import { AboutContentComponent } from '../../popup/components/info-popups/about-content/about-content.component';
import { PopupService } from '../../popup/services/popup.service';

import { TranslationService } from '../../i18n/services/translation.service';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';

import { PowerliftingChatService } from '../../chat/services/powerlifting-chat.service';

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

  isMobile = window.innerWidth < 768;
  isLandscape = window.innerHeight < 568;

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile = window.innerWidth < 768;
    this.isLandscape = window.innerHeight < 568;
  }
  
  AboutContentComponent: Type<any> = AboutContentComponent;

  constructor(
    public popup: PopupService, 
    public tService: TranslationService,
    private chatService: PowerliftingChatService
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

  openAssistant() {
    this.chatService.openChat();
  }
}
