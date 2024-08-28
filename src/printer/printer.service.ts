import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: 'Roboto/Roboto-Regular.ttf',
    bold: 'Roboto/Roboto-Medium.ttf',
    italics: 'Roboto/Roboto-Italic.ttf',
    bolditalics: 'Roboto/Roboto-MediumItalic.ttf',
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts); //segundo objeto es la configuracion de las impresoras

  async createPdf(docDefinition: TDocumentDefinitions) {
    return this.printer.createPdfKitDocument(docDefinition);
  }
}
