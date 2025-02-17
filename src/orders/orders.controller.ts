import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
  PaidOrderDto,
} from './dto';
import { Roles, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interface';
import { AuthGuard, OrderAuthGuard, RolesGuard } from 'src/auth/guards';
import { RolesUserList } from 'src/auth/enum/roles-enum';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(OrderAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @User() user?: CurrentUser) {
    if (!user) {
      if (
        !createOrderDto.name ||
        !createOrderDto.phone ||
        !createOrderDto.address
      ) {
        throw new BadRequestException(
          'Name, phone, and address are required for guest orders',
        );
      }
    }
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    RolesUserList.DESARROLLADOR,
    RolesUserList.ADMINISTRADOR,
    RolesUserList.CAJA,
    RolesUserList.USER,
    RolesUserList.COCINA,
  )
  findAll(@Param() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    RolesUserList.DESARROLLADOR,
    RolesUserList.ADMINISTRADOR,
    RolesUserList.CAJA,
    RolesUserList.USER,
    RolesUserList.COCINA,
  )
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    RolesUserList.DESARROLLADOR,
    RolesUserList.ADMINISTRADOR,
    RolesUserList.CAJA,
  )
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
    @User() user?: CurrentUser,
  ) {
    return this.ordersService.changeStatus(id, changeOrderStatusDto, user);
  }

  @Get('status/:id')
  orderStatusHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrderStatusHistory(id);
  }

  @Patch('paid/:id')
  changePaidorder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() paidOrderDto: PaidOrderDto,
  ) {
    return this.ordersService.paidOrder(id, paidOrderDto);
  }
}
