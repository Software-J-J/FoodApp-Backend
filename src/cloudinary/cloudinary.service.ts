import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponseDto } from './dto/cloudinary-response.dto';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponseDto> {
    return new Promise<CloudinaryResponseDto>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'FoodApp' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
