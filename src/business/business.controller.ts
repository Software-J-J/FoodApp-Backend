import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDto } from 'src/common';

@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    createBusinessDto.logo = uploadResult.url;
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  findAll(@Param() paginationDto: PaginationDto) {
    return this.businessService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.businessService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessService.update(updateBusinessDto.id, updateBusinessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessService.remove(+id);
  }
}
