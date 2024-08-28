import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { PrinterModule } from './printer/printer.module';

@Module({
  imports: [ProductsModule, CloudinaryModule, OrdersModule, AuthModule, ReportsModule, PrinterModule],
})
export class AppModule {}
