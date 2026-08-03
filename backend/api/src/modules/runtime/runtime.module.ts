import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { RuntimeController } from './runtime.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(
        process.cwd(),
        '..',
        '..',
        'runtime',
        'dist',
        'runtime',
        'browser',
      ),
      serveRoot: '/runtime',
    }),
  ],
  controllers: [
    RuntimeController,
  ],
})
export class RuntimeModule {}