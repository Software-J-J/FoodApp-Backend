import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { AuthGuard, OrderAuthGuard } from './guards';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, OrderAuthGuard],
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpire },
    }),
  ],
  exports: [AuthGuard],
})
export class AuthModule {}
