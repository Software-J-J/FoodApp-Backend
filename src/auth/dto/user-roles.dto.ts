import { RoleEnum } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UserRolesDto {
  @IsString()
  @IsEnum(RoleEnum, {
    message: `Valid Rol are ${RoleEnum}`,
  })
  roles: RoleEnum;
}
