import { Controller, Post, Body } from '@nestjs/common';

import { NominationOptionsService } from './nomination-options.service';
import { SetNominationDatesDto } from './dto/set-nomination-dates.dto';

@Controller('api/nominations')
export class NominationsController {

    constructor(
        private readonly nominationOptionsService: NominationOptionsService,
    ) {}

    @Post('nomination-dates')
    async setNominationDates(
        @Body() data: SetNominationDatesDto,
    ): Promise<void> {
console.log('CONTROLLER CALLED');
console.log('DTO:', data);
        await this.nominationOptionsService.setNominationDates(
            data.competitionId,
            data.preliminaryDate,
            data.finalDate,
        );
console.log('Nomination dates saved');
    }


}
