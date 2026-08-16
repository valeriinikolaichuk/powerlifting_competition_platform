import { IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Language, DeviceMode } from '@prisma/client';

export class DeviceParametersDto {

    @IsString()
    device_id!: string;

    @IsEnum(Language)
    @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
    language!: Language;

    @IsEnum(DeviceMode)
    @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
    mode!: DeviceMode;

    @IsString()
    user_agent!: string;
}
