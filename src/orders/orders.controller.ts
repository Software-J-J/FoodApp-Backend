import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
} from './dto';
import { Roles, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interface';
import { AuthGuard, OrderAuthGuard, RolesGuard } from 'src/auth/guards';
import { RolesUserList } from 'src/auth/enum/roles-enum';

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
  ) {
    return this.ordersService.changeStatus(id, changeOrderStatusDto);
  }
}
