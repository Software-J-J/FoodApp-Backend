import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { PrinterModule } from './printer/printer.module';
import { BusinessModule } from './business/business.module';
import { CategoryModule } from './category/category.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ProductsModule,
    CloudinaryModule,
    OrdersModule,
    AuthModule,
    ReportsModule,
    PrinterModule,
    BusinessModule,
    CategoryModule,
    ChatModule,
    NotificationsModule,
  ],
})
export class AppModule {}
