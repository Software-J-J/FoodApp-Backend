import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  NATS_SERVERS: string[];
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_SECRET: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
}

const envsShema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_CLOUD_NAME: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRE: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsShema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  natsServers: envVars.NATS_SERVERS,
  cloudinaryApiKey: envVars.CLOUDINARY_API_KEY,
  cloudinaryCloudName: envVars.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiSecret: envVars.CLOUDINARY_API_SECRET,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpire: envVars.JWT_EXPIRE,
};
