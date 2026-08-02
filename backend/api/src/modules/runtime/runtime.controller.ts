import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class RuntimeController {

    @Get('runtime')
    getRuntime(
        @Res() res: Response
    ) {

        return res.sendFile(
            join(
                process.cwd(),
                'runtime',
                'index.html'
            )
        );

    }
}
