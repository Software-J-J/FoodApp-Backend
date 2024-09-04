import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BusinessIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.businessId) {
      // El usuario tiene un businessId asociado
      request.businessId = user.businessId;
      return true;
    }

    throw new UnauthorizedException(
      'User does not have access to this business',
    );
  }
}
