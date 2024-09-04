import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  public name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  public description: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @Min(0)
  @Type(() => Number)
  public price: number;

  @IsString()
  public category: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  public image: string;

  @IsUUID()
  @IsOptional()
  businessId: string;

  @IsBoolean()
  @IsOptional()
  public status: boolean;
}
