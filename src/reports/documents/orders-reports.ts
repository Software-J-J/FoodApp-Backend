import {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { CreateBusinessDto } from 'src/business/dto';
import { getImageAsBase64 } from '../helpers/image-base';
import { Formatter } from '../helpers/formatter';

export const orderReports = async (
  order: any,
  business: CreateBusinessDto,
): Promise<TDocumentDefinitions> => {
  const base64Logo = await getImageAsBase64(business.logo);

  const logoBusiness: Content = {
    image: `data:image/png;base64,${base64Logo}`,
    width: 50,
    alignment: 'center',
  };

  const style: StyleDictionary = {
    header: {
      alignment: 'center',
      margin: [0, 10, 0, 10],
      fillColor: 'black',
      bold: true,
      marginTop: 3,
    },
    title: {
      fontSize: 25,
      bold: true,
      alignment: 'center',
      margin: [0, 10],
    },
    subheader: {
      fontSize: 14,
      margin: [0, 10],
      alignment: 'center',
    },
    table: {
      margin: [0, 20],
    },
    qr: {
      alignment: 'center',
      margin: [10, 10],
    },
  };
  const totalOrder = order.totalAmount;

  return {
    content: [
      {
        columns: [
          {
            width: '*',
            stack: [
              logoBusiness,
              {
                text: `${business.name}`,
                style: 'title',
              },
              {
                text: [
                  { text: `${business.address}\n `, style: 'h2' },
                  `Parana Entre Rios.\n`,
                ],
                alignment: 'center',
                margin: [0, 10],
              },
              {
                text: [
                  { text: `Tel:${business.phone} \n `, style: 'h3' },
                  `Envios a domicilio\n `,
                ],
                alignment: 'center',
              },
            ],
          },
        ],
      },
      {
        text: `Orden # ${order.orderNumber}`,
        style: 'header',
      },
      {
        text: `Cliente: ${order.guestName}`,
        style: 'subheader',
      },
      {
        text: `Direccion: ${order.guestAddress}`,
        style: 'subheader',
      },
      {
        text: `Tel: ${order.phone}`,
        style: 'subheader',
      },
      {
        margin: [0, 20],
        layout: 'lightHorizontalLines',
        table: {
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            ['Productos', 'Precio', 'Cantidad', 'Total'],
            ...order.OrderItem.map((item) => [
              item.name,
              Formatter.currency(item.price),
              item.quantity,
              {
                text: Formatter.currency(item.price * item.quantity),
                bold: true,
                alignment: 'right',
              },
            ]),
            [{}, {}, {}, {}],
            [
              {},
              {},
              {
                text: 'Total Orden',
                colSpan: 1,
                alignment: 'right',
                fillColor: 'black',
                color: 'white',
                bold: true,
                margin: [5, 5],
              },
              {
                text: Formatter.currency(totalOrder),
                bold: true,
                alignment: 'right',
                fillColor: 'black',
                color: 'white',
                margin: [5, 5],
              },
            ],
          ],
        },
      },
      {
        text: `Metodo de entrega: ${order.deliveryMethod}`,
        style: 'subheader',
      },
      {
        qr: 'https://www.linkedin.com/in/kevinjbarrios/',
        fit: 75,
        alignment: 'center',
      },
      {
        text: '¡Escanea el QR y enterate de todas las promos!',
        style: 'h2',
        alignment: 'center',
      },
    ],
    styles: style,
  };
};
