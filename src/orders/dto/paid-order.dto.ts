import { IsBoolean, IsString, IsUrl, IsUUID } from 'class-validator';

export class PaidOrderDto {
  // @IsString()
  // stripePaymentId: string;

  @IsBoolean()
  paid: boolean;

  // @IsString()
  // @IsUrl()
  // receiptUrl: string;
}
