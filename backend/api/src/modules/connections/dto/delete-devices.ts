import { IsArray, IsString } from 'class-validator';

export class DeleteDevicesDto {

  @IsArray()
  @IsString({ each: true })
  device_ids!: string[];
}