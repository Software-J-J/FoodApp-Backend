import { v2 as cloudinary } from 'cloudinary';
import { envs } from 'src/config';

export const CloudinaryProviders = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: envs.cloudinaryCloudName,
      api_key: envs.cloudinaryApiKey,
      api_secret: envs.cloudinaryApiSecret,
    });
  },
};
