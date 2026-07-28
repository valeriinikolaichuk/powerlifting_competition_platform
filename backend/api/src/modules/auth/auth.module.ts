import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticationCookieService } from './cookies/authentication-cookie.service';

import { LOGIN_METHODS, LOGIN_STRATEGIES, TOKEN_COOKIE_POLICY } from './auth.tokens';

import { MethodPipelineService } from './method-pipeline/method-pipeline.service';
import { LoginMethodDefault } from './method-pipeline/login-method-default';

import { AuthFactoryService } from './authentication/auth-factory.service';
import { AuthDefaultService } from './authentication/auth-default.service';

import { SessionPolicyFactoryService } from './policy/session-policy-factory.service';
import { OfflineSessionPolicy } from './policy/offline-session-policy';
import { OnlineSessionPolicy } from './policy/online-session-policy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY',
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [

  // iterable<MethodPipelineInterface>
    LoginMethodDefault,

    {
      provide: LOGIN_METHODS,
      useFactory: (
        defaultMethod,
      ) => [
        defaultMethod,
      ],
      inject: [
        LoginMethodDefault,
      ],
    },

    MethodPipelineService,
    
// iterable<AuthenticatorAbstract>
    AuthDefaultService,

    {
      provide: LOGIN_STRATEGIES,
      useFactory: (
        authDefault,
      ) => [
        authDefault,
      ],
      inject: [
        AuthDefaultService,
      ],
    },

    AuthFactoryService,

// iterable<SessionPolicyInterface>
    OfflineSessionPolicy,
    OnlineSessionPolicy,

    {
        provide: TOKEN_COOKIE_POLICY,
        useFactory: (
            offline: OfflineSessionPolicy,
            online: OnlineSessionPolicy,
        ) => [
            offline,
            online,
        ],
        inject: [
            OfflineSessionPolicy,
            OnlineSessionPolicy,
        ],
    },

    SessionPolicyFactoryService,

    AuthService,
    JwtStrategy,
    AuthenticationCookieService,
  ],
})
export class AuthModule {}
