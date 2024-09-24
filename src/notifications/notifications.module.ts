import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
  imports: [AuthModule],
})
export class NotificationsModule {}
