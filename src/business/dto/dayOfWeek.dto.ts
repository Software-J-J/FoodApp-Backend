import { DayOfWeek } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class DayOftWeekDto {
  @IsEnum(DayOfWeek, {
    message: `Valid staus are ${DayOfWeek}`,
  })
  status: DayOfWeek;
}
