import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BusinessService } from 'src/business/business.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, BusinessService],
  imports: [AuthModule, NotificationsModule],
  exports: [OrdersService, BusinessService], // Exportar OrdersService
})
export class OrdersModule {}
