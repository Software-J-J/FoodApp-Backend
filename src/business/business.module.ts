import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService],
  imports: [CloudinaryModule],
})
export class BusinessModule {}
