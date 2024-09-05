import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class BusinessService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('BussinesDB');

  onModuleInit() {
    this.$connect();
    this.logger.log('Bussines Connect Database');
  }

  async create(createBusinessDto: CreateBusinessDto) {
    try {
      const bussines = await this.business.findUnique({
        where: {
          email: createBusinessDto.email,
        },
      });

      if (bussines) {
        throw new NotFoundException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Bussines already exists.',
        });
      }

      const newBussines = await this.business.create({
        data: {
          name: createBusinessDto.name,
          description: createBusinessDto.description,
          address: createBusinessDto.address,
          phone: createBusinessDto.phone,
          email: createBusinessDto.email,
          logo: createBusinessDto.logo,
          colors: createBusinessDto.colors,
          redes: createBusinessDto.redes,
          OpeningHours: {
            create: createBusinessDto.openingHours.map((hours) => ({
              dayOfWeek: hours.dayOfWeek,
              openTime: hours.openTime,
              closeTime: hours.closeTime,
            })),
          },
        },
      });

      return newBussines;
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const totalPages = await this.business.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.business.findMany({
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

  async findOne(id: string) {
    const business = await this.business.findFirst({
      where: { id },
      include: {
        OpeningHours: {
          select: {
            dayOfWeek: true,
            openTime: true,
            closeTime: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Business with id ${id} not found`,
      });
    }
    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    const { id: _, ...data } = updateBusinessDto;

    await this.findOne(id);

    return this.business.update({
      where: { id },
      data: data,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} business`;
  }
}
