import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
  PaidOrderDto,
} from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersDB');

  onModuleInit() {
    this.$connect();
    this.logger.log('Orders Database Connect.');
  }
  async create(createOrderDto: CreateOrderDto, user?: any) {
    try {
      const productIds = createOrderDto.items.map((item) => item.productId);

      const products: any[] = await this.validateProducts(productIds);

      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;

        return acc + price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      const orderData = user
        ? {
            userId: user.id,
            guestName: user.name,
            guestPhone: user.phone,
            guestAddress: user.address,
            businessId: user.businessId, // Asegúrate de pasar el businessId del usuario
          }
        : {
            userId: null,
            guestName: createOrderDto.name,
            guestPhone: createOrderDto.phone,
            guestAddress: createOrderDto.address,
            businessId: createOrderDto.businessId, // Si no hay usuario, obtener businessId del DTO
          };

      const order = await this.order.create({
        data: {
          ...orderData,
          totalAmount: totalAmount,
          totalItems: totalItems,
          status: 'PENDING',
          deliveryMethod: createOrderDto.deliveryMethod || user.deliveryMethod,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(
                  (product) => product.id === orderItem.productId,
                ).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity,
              })),
            },
          },
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      return {
        ...order,
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem,
          name: products.find((product) => product.id === orderItem.productId)
            .name,
        })),
        orderNumber: order.orderNumber,
      };
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Check logs',
      });
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status,
      },
    });

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginationDto.status,
        },
        orderBy: { createdAt: 'desc' },
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },
      include: {
        OrderItem: {
          select: {
            price: true,
            productId: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }

    const productIds = order.OrderItem.map((orderItem) => orderItem.productId);
    const products: any[] = await this.validateProducts(productIds);

    return {
      ...order,
      OrderItem: order.OrderItem.map((orderItem) => ({
        ...orderItem,
        name: products.find((product) => product.id === orderItem.productId)
          .name,
      })),
    };
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

  async changeStatus(
    id: string,
    changeOrderStatusDto: ChangeOrderStatusDto,
    user: any,
  ) {
    const { status } = changeOrderStatusDto;

    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    await this.orderStatusHistory.create({
      data: {
        orderId: id,
        status: status,
        changedAt: new Date(),
        changedBy: user.id,
      },
    });

    return this.order.update({
      where: { id },
      data: { status: status },
    });
  }

  async getOrderStatusHistory(orderId: string) {
    return await this.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { changedAt: 'desc' },
    });
  }

  async paidOrder(id: string, paidOrderDto: PaidOrderDto) {
    const updatePaidOrder = await this.order.update({
      where: {
        id: id,
      },
      data: { paid: paidOrderDto.paid, paidAt: new Date() },
    });

    return updatePaidOrder;
  }
}
