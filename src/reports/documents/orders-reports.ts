import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { CreateBusinessDto } from 'src/business/dto';
import { getImageAsBase64 } from '../helpers/image-base';

export const orderReports = async (
  order: any,
  business: CreateBusinessDto,
): Promise<TDocumentDefinitions> => {
  const base64Logo = await getImageAsBase64(business.logo);

  const logoBusiness = {
    image: `data:image/png;base64,${base64Logo}`,
    width: 90,
  };

  return {
    content: [
      logoBusiness,
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
};
