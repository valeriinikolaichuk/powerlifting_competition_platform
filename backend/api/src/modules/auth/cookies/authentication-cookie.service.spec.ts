import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationCookieService } from './authentication-cookie.service';

describe('AuthenticationCookieService', () => {
  let service: AuthenticationCookieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationCookieService],
    }).compile();

    service = module.get<AuthenticationCookieService>(AuthenticationCookieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
