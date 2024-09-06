import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { OrdersService } from 'src/orders/orders.service';
import { RolesUserList } from 'src/auth/enum/roles-enum';
import { Roles, User } from 'src/auth/decorators';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/interface';
import { BusinessService } from 'src/business/business.service';
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly ordersService: OrdersService,
    private readonly bussinesService: BusinessService,
  ) {}

  @Get('bill')
  async getBllReport(@Res() response: Response) {
    const pdfDoc = await this.reportsService.getBillReports();

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('order/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUserList.DESARROLLADOR, RolesUserList.ADMINISTRADOR)
  async printOrder(
    @Param('id') id: string,
    @Res() response: Response,
    @User() user: CurrentUser,
  ) {
    const order = await this.ordersService.findOne(id);

    const business = await this.bussinesService.findOne(user.businessId);

    if (!order) {
      return response.status(404).json({ message: 'Order not found' });
    }

    if (!business) {
      return response.status(404).json({ message: 'Business not found' });
    }

    
    const pdfDoc = await this.reportsService.getOrderReport(order, business);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
