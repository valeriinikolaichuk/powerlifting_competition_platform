import { IsDateString, IsUUID } from 'class-validator';

export class SetNominationDatesDto {
  @IsUUID()
  competitionId!: string;

  @IsDateString()
  preliminaryDate!: string;

  @IsDateString()
  finalDate!: string;
}