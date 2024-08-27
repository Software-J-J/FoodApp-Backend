import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProviders } from './cloudinary.provider';

@Module({
  providers: [CloudinaryService, CloudinaryProviders],
  exports: [CloudinaryProviders, CloudinaryService],
})
export class CloudinaryModule {}
