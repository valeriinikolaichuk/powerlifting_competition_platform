import { TestBed } from '@angular/core/testing';

import { PowerliftingChatService } from './powerlifting-chat.service';

describe('PowerliftingChatService', () => {
  let service: PowerliftingChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowerliftingChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
