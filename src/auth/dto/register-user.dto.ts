import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { DeliveryMethod, UserRoles } from '@prisma/client';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  @IsStrongPassword()
  password: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number is not valid',
  })
  phone: string;

  @IsString()
  @MaxLength(50)
  address: string;

  @IsEnum(UserRoles, {
    each: true,
    message: `Valid roles are ${Object.values(UserRoles).join(', ')}`,
  })
  roles: UserRoles[] = [UserRoles.USER];

  @IsEnum(DeliveryMethod, {
    each: true,
    message: `Valid roles are ${Object.values(DeliveryMethod).join(', ')}`,
  })
  deliveryMethod: DeliveryMethod = DeliveryMethod.DELIVERY;

  @IsUUID()
  @IsOptional()
  businessId: string;
}
