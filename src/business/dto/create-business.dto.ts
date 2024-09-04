import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @IsOptional()
  description: string;

  @IsString()
  @MinLength(4)
  address: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number is not valid',
  })
  phone: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  logo: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  colors: string[];
}
