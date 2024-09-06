import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BusinessService } from 'src/business/business.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, BusinessService],
  imports: [AuthModule],
  exports: [OrdersService, BusinessService], // Exportar OrdersService
})
export class OrdersModule {}
