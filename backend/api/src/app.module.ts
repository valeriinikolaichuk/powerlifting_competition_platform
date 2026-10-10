import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RuntimeModule } from './modules/runtime/runtime.module';
import { ConnectionsModule } from './modules/connections/connections.module';
import { SyncModule } from './modules/sync/sync.module';
import { NominationsModule } from './modules/nominations/nominations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    RuntimeModule,
    ConnectionsModule,
    SyncModule,
    NominationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
