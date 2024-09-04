import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      console.log('No roles defined in metadata');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    if (!user || !user.roles || !this.matchRoles(roles, user.roles)) {
      throw new ForbiddenException(
        'No tienes el rol necesario para acceder a este recurso',
      );
    }

    return this.matchRoles(roles, user.roles);
  }

  private matchRoles(roles: string[], userRoles: string[]): boolean {
    return roles.some((role) => userRoles.includes(role));
  }
}
