import { UserRoles } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UserRolesDto {
  @IsString()
  @IsEnum(UserRoles, {
    message: `Valid Rol are ${UserRoles}`,
  })
  roles: UserRoles;
}
