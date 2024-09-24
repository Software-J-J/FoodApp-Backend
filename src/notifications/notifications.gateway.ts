import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const { businessId, roles } = client.handshake.query;

    if (typeof businessId === 'string') {
      const rolesArray = Array.isArray(roles) ? roles : [roles];

      this.notificationsService.addClient(client, businessId, rolesArray);
    } else {
      console.error('Invalid businessId format');
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const { businessId } = client.handshake.query;
    if (businessId) {
      this.notificationsService.removeClient(client, businessId as string);
    }
  }
}
