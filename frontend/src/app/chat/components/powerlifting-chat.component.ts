import { Component, OnInit } from '@angular/core';
import { createChat } from '@n8n/chat';
import { CommonModule } from '@angular/common';

import { PowerliftingChatService } from '../services/powerlifting-chat.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-powerlifting-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './powerlifting-chat.component.html',
})
export class PowerliftingChatComponent implements OnInit {
  
  private isInitialized = false;

  constructor(
    public chatService: PowerliftingChatService
  ) {}

  ngOnInit() {

    this.chatService.chatState$.subscribe((isOpened) => {

      if (isOpened && !this.isInitialized) {
        this.initN8nChat();
        this.isInitialized = true;
      }
    });
  }

  closeChat() {
    this.chatService.toggleChat();
  }

  initN8nChat() {
    
    createChat({
      webhookUrl: environment.n8nChatUrl,
      target: '#n8n-chat-container',
      mode: 'fullscreen',
      showWelcomeScreen: false,
      loadPreviousSession: false,
      initialMessages: [],

      defaultLanguage: 'en',

      i18n: {
        en: {
          title: 'AI Assistant',
          subtitle: '',
          footer: '',
          getStarted: 'New conversation',
          inputPlaceholder: 'Type your question...',
          closeButtonTooltip: 'Close chat'
        }
      },

      metadata: {
        isAuth: false,
        fullName: 'Guest'
      }
    });

    this.isInitialized = true;
  }
}
