import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from 'src/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interface';
import { RolesGuard } from 'src/auth/guards';

@Controller('products')
@UseGuards(RolesGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: CurrentUser,
  ) {
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    createProductDto.image = uploadResult.url;

    const businessId = user.businessId;

    // Asigna el businessId al DTO
    createProductDto.businessId = businessId;

    return this.productsService.create(createProductDto);
  }

  @Get(':businessId')
  @Roles('USER', 'ADMIN')
  findAll(
    @Query() paginationDto: PaginationDto,
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ) {
    return this.productsService.findAll(paginationDto, businessId);
  }

  @Get('id/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
