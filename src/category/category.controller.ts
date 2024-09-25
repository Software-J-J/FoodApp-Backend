import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles, User } from 'src/auth/decorators';
import { RolesUserList } from 'src/auth/enum/roles-enum';
import { CurrentUser } from 'src/auth/interface';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    RolesUserList.DESARROLLADOR,
    RolesUserList.ADMINISTRADOR,
    RolesUserList.CAJA,
    RolesUserList.USER,
    RolesUserList.COCINA,
  )
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() user?: CurrentUser,
  ) {
    return this.categoryService.create(createCategoryDto, user);
  }

  @Get(':businessId')
  findAll(@Param('businessId', ParseUUIDPipe) businessId: string) {
    return this.categoryService.findAll(businessId);
  }

  @Get('id/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
