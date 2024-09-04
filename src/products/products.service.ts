import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { BusinessDtoProducts } from 'src/orders/dto/business.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsDB');

  onModuleInit() {
    this.$connect();
    this.logger.log('Products DB Connect');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: { ...createProductDto, businessId: createProductDto.businessId },
    });
  }

  async findAll(paginationDto: PaginationDto, businessId: string) {
    console.log(businessId);

    const { limit, page } = paginationDto;

    const totalPages = await this.product.count({
      where: { businessId: businessId },
    });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        where: { businessId: businessId },
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        page: page,
        lastPage: lastPage,
        total: totalPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, status: true },
    });
    if (!product)
      throw new NotFoundException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.product.update({
      where: { id },
      data: {
        status: false,
      },
    });

    return product;
  }

  async validateProducts(ids: number[]) {
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (products.length !== ids.length) {
      throw new NotFoundException({
        message: 'Some products were not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
