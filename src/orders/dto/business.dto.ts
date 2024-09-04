import { IsUUID } from 'class-validator';

export class BusinessDtoProducts {
  @IsUUID()
  businessId: string;
}