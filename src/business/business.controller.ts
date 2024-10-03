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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDto } from 'src/common';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators';
import { RolesUserList } from 'src/auth/enum/roles-enum';

@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll(@Param() paginationDto: PaginationDto) {
    return this.businessService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.businessService.findOne(id);
  }

  @Post()
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(RolesUserList.DESARROLLADOR, RolesUserList.USER)
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      createBusinessDto.logo =
        'https://cdn.pixabay.com/photo/2018/03/19/02/52/logo-instagram-3238899_1280.png';
    } else {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      createBusinessDto.logo = uploadResult.url;
    }
    return this.businessService.create(createBusinessDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUserList.DESARROLLADOR, RolesUserList.ADMINISTRADOR)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    updateBusinessDto.logo = uploadResult.url;
    console.log(uploadResult);
    console.log(updateBusinessDto);

    return this.businessService.update(id, updateBusinessDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUserList.DESARROLLADOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessService.remove(+id);
  }
}
