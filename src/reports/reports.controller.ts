import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { OrdersService } from 'src/orders/orders.service';
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
