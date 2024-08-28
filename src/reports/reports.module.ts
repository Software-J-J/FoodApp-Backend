import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [PrinterModule, OrdersModule], // Asegúrate de importar OrdersModule
})
export class ReportsModule {}
