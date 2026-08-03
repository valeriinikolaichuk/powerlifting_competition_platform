import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller('runtime')
export class RuntimeController {

  @Get()
  getRuntime(@Res() res: Response) {

    return res.sendFile(
      join(
        process.cwd(),
        '..',
        '..',
        'runtime',
        'dist',
        'runtime',
        'browser',
        'index.html',
      ),
    );
  }
}
