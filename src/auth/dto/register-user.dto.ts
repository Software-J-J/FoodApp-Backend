import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { UserRolesDto } from './user-roles.dto';
import { Type } from 'class-transformer';
import { UserRoles } from '@prisma/client';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number is not valid',
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  address: string;

  @IsEnum(UserRoles, {
    each: true, // Esto valida cada elemento si roles es un array
    message: `Valid roles are ${Object.values(UserRoles).join(', ')}`,
  })
  roles: UserRoles[] = [UserRoles.USER];
}
