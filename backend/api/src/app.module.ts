import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RuntimeModule } from './modules/runtime/runtime.module';
import { ConnectionsModule } from './modules/connections/connections.module';
import { SyncModule } from './modules/sync/sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    RuntimeModule,
    ConnectionsModule,
    SyncModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
