import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { OrdersService } from 'src/orders/orders.service';
import { RolesUserList } from 'src/auth/enum/roles-enum';
import { Roles } from 'src/auth/decorators';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly ordersService: OrdersService,
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
  async printOrder(@Param('id') id: string, @Res() response: Response) {
    const order = await this.ordersService.findOne(id);

    if (!order) {
      return response.status(404).json({ message: 'Order not found' });
    }

    const pdfDoc = await this.reportsService.getOrderReport(order);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
