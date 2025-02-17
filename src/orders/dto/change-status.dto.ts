import { OrderStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { OrderStatusList } from '../enum/enum-orders';

export class ChangeOrderStatusDto {
  @IsEnum(OrderStatusList, {
    message: `Valid staus are ${OrderStatusList}`,
  })
  status: OrderStatus;
}
