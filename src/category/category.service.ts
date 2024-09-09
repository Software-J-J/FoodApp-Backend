import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoryService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('CategoryDb');
  onModuleInit() {
    this.$connect();
    this.logger.log('Category DB Connect');
  }
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all category`;
  }

  async findOne(id: number) {
    const category = await this.category.findFirst({
      where: { id, status: true },
    });

    if (!category)
      throw new NotFoundException({
        message: `category with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });

    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
