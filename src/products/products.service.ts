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

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsDB');

  onModuleInit() {
    this.$connect();
    this.logger.log('Products DB Connect');
  }

  async create(createProductDto: CreateProductDto) {
    const { category, businessId, ...rest } = createProductDto;

    const categoryRecord = await this.category.findUnique({
      where: {
        name_businessId: {
          name: category,
          businessId: businessId,
        },
      },
    });

    if (!categoryRecord) {
      throw new NotFoundException('Category not found');
    }

    const productData: any = {
      ...rest,
      category: {
        connect: { id: categoryRecord.id },
      },
    };

    if (businessId) {
      productData.Business = {
        connect: { id: businessId },
      };
    }

    return this.product.create({
      data: productData,
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
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
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
    const { category, businessId, ...data } = updateProductDto;

    await this.product.findUniqueOrThrow({
      where: { id },
    });

    const updateData: any = { ...data };

    if (category) {
      const categoryRecord = await this.category.findUnique({
        where: {
          name_businessId: {
            name: category,
            businessId: businessId,
          },
        },
      });

      if (!categoryRecord) {
        throw new NotFoundException('Category not found');
      }

      updateData.category = {
        connect: { id: categoryRecord.id },
      };
    }

    if (businessId) {
      updateData.business = {
        connect: { id: businessId },
      };
    }

    return this.product.update({
      where: { id },
      data: updateData,
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
