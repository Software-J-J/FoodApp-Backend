import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessDto } from './create-business.dto';
import { IsUUID } from 'class-validator';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {
  @IsUUID()
  id: string;
}
