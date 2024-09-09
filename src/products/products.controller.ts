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
import { RolesUserList } from 'src/auth/enum/roles-enum';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    RolesUserList.DESARROLLADOR,
    RolesUserList.ADMINISTRADOR,
    RolesUserList.USER,
  )
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: CurrentUser,
  ) {
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    createProductDto.image = uploadResult.url;

    const businessId = user.businessId;
    
    createProductDto.businessId = businessId;

    return this.productsService.create(createProductDto);
  }

  @Get(':businessId')
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUserList.DESARROLLADOR, RolesUserList.ADMINISTRADOR)
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUserList.DESARROLLADOR, RolesUserList.ADMINISTRADOR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
