import { Type } from 'class-transformer';
import { IsString, Matches, IsEnum } from 'class-validator';
import { DayOfWeek } from '@prisma/client';

export class OpeningHoursDto {
  @IsEnum(DayOfWeek, {
    message: `Valid days are ${Object.values(DayOfWeek).join(', ')}`,
  })
  dayOfWeek: DayOfWeek;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Invalid time format. Use HH:MM',
  })
  openTime: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Invalid time format. Use HH:MM',
  })
  closeTime: string;
}
