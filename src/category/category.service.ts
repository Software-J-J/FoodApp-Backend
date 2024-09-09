import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('CategoryDb');
  onModuleInit() {
    this.$connect();
    this.logger.log('Category DB Connect');
  }
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.category.create({
      data: {
        ...createCategoryDto,
      },
    });
  }

  async findAll() {
    return await this.category.findMany({
      where: { status: true },
    });
  }

  async findOne(id: number) {
    const category = await this.category.findFirst({
      where: { id, status: true },
      include: {
        products: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!category)
      throw new NotFoundException({
        message: `category with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    return await this.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const category = await this.category.update({
      where: { id },
      data: {
        status: false,
      },
    });

    return category;
  }
}
