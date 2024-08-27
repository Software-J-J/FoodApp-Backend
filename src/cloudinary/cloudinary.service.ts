import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponseDto } from './dto/cloudinary-response.dto';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponseDto> {
    return new Promise<CloudinaryResponseDto>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'FoodApp' }, // Puedes especificar una carpeta en Cloudinary
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // Convertimos el buffer a stream y lo pasamos al stream de Cloudinary
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
