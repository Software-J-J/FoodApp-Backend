import { Injectable } from '@nestjs/common';
import * as path from 'path';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: path.resolve(__dirname, '../Roboto/Roboto-Regular.ttf'),
    bold: path.resolve(__dirname, '../Roboto/Roboto-Bold.ttf'),
    italics: path.resolve(__dirname, '../Roboto/Roboto-Italic.ttf'),
    bolditalics: path.resolve(__dirname, '../Roboto/Roboto-BoldItalic.ttf'),
  },
};


@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  async createPdf(docDefinition: TDocumentDefinitions) {
    return this.printer.createPdfKitDocument(docDefinition);
  }
}
