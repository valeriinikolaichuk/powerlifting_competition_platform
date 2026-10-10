import { Module } from '@nestjs/common';
import { NominationsController } from './nominations.controller';
import { NominationOptionsService } from './nomination-options.service';

@Module({
  controllers: [NominationsController],
  providers: [NominationOptionsService]
})
export class NominationsModule {}
