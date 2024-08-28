import type {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { Formatter } from '../helpers/formatter';

const logo: Content = {
  image: 'src/assets/logoNest.png',
  width: 90,
};

const style: StyleDictionary = {
  h1: {
    fontSize: 22,
    bold: true,
    margin: [0, 20],
  },
  h2: {
    fontSize: 15,
    bold: true,
  },
  h3: {
    fontSize: 10,
    bold: true,
  },
};

const billOrders = [
  {
    id: 1,
    Producto: 'Caca',
    Precio: 11,
    Cantidad: 2,
    total: 11 * 2,
  },
];
export const billReports = (): TDocumentDefinitions => {
  return {
    header: {
      text: 'Bill Report',
      alignment: 'right',
      margin: [10, 10], // margenes
    },
    content: [
      logo,
      {
        text: 'Food App',
        style: 'h1',
      },

      //DIRECCION DE LA EMPRESA COLUMNA #1
      {
        columns: [
          {
            text: [
              { text: `Cervantes 16 PB\n `, style: 'h2' },
              `Parana Entre Rios\n  Instagram: SimonCokies`,
            ],
          },
          {
            text: [
              { text: `Numero: 3437445403 \n `, style: 'h3' },
              `Envios a domicilio\n `,
            ],
            alignment: 'right',
          },
        ],
      },

      //implementacion del codigo QR
      {
        qr: 'https://www.twitch.tv/stratozoma/',
        fit: 100,
        alignment: 'right',
      },

      //tabla con el pedido
      {
        margin: [0, 20],

        table: {
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            ['ID', 'Producto', 'Precio', 'Cantidad', 'Total'],
            ...billOrders.map((product) => [
              product.id,
              product.Producto,
              Formatter.currency(product.Precio),
              product.Cantidad,
              product.total,
            ]),
          ],
        },
      },
    ],
    styles: style,
  };
};
