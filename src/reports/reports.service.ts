import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { billReports } from './documents/bill.reports';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class ReportsService {
  constructor(private readonly printer: PrinterService) {}

  async getBillReports(): Promise<PDFKit.PDFDocument> {
    const docDefinition = billReports();

    return this.printer.createPdf(docDefinition);
  }

  async getOrderReport(order: any): Promise<PDFKit.PDFDocument> {
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Order Ticket', style: 'header' },
        { text: `Order ID: ${order.id}`, style: 'subheader' },
        { text: `Cliente: ${order.guestName}`, style: 'subheader' },
        { text: `Telefono: ${order.guestPhone}`, style: 'subheader' },
        { text: `Direccion: ${order.guestAddress}`, style: 'subheader' },
        {
          text: `Delivery Method: ${order.deliveryMethod}`,
          style: 'subheader',
        },
        { text: `Fecha de la Orden: ${order.createdAt}`, style: 'subheader' },
        { text: `Total De Compra: $${order.totalAmount}`, style: 'subheader' },

        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Total'],
              ...order.OrderItem.map((item) => [
                item.name,
                item.price,
                item.quantity,
                item.price * item.quantity,
              ]),
            ],
          },
          margin: [0, 20],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 14, margin: [0, 10, 0, 5] },
      },
    };

    return this.printer.createPdf(docDefinition);
  }
}
