import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}
