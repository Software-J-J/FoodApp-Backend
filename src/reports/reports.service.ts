import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { billReports } from './documents/bill.reports';
import { orderReports } from './documents/orders-reports';

@Injectable()
export class ReportsService {
  constructor(private readonly printer: PrinterService) {}

  async getBillReports(): Promise<PDFKit.PDFDocument> {
    const docDefinition = billReports();
    return this.printer.createPdf(docDefinition);
  }

  async getOrderReport(order: any, business: any): Promise<PDFKit.PDFDocument> {

    const docDefinition = await orderReports(order, business);

    return this.printer.createPdf(docDefinition);
  }
}
