import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductsModule, CloudinaryModule, OrdersModule, AuthModule],
})
export class AppModule {}
