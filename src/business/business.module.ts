import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService],
  imports: [CloudinaryModule, AuthModule],
})
export class BusinessModule {}
