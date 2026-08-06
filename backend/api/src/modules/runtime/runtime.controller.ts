import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller('runtime')
export class RuntimeController {

  @Get()
  async getRuntime(
//    @Query('lang') lang: string,
    @Res() res: Response,
  ) {

//    if (lang === 'en' || lang === 'uk' || lang === 'pl') {
      // записати мову в БД
      // await ...
//    }

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
