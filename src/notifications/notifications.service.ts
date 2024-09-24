import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RolesUserList } from 'src/auth/enum/roles-enum';

@Injectable()
export class NotificationsService {
  private connectedClients = new Map<
    string,
    { socket: Socket; roles: string[] }[]
  >();

  addClient(client: Socket, businessId: string, roles: string[]) {
    const clients = this.connectedClients.get(businessId) || [];
    clients.push({ socket: client, roles });
    this.connectedClients.set(businessId, clients);
  }

  removeClient(client: Socket, businessId: string) {
    const clients = this.connectedClients.get(businessId) || [];
    const updatedClients = clients.filter(
      ({ socket }) => socket.id !== client.id,
    );

    if (updatedClients.length === 0) {
      this.connectedClients.delete(businessId);
    } else {
      this.connectedClients.set(businessId, updatedClients);
    }
  }

  sendNotificacionToAdmins(businessId: string, order: any) {
    const clients = this.connectedClients.get(businessId);

    clients.forEach(({ socket, roles }) => {
      if (
        roles.includes(RolesUserList.ADMINISTRADOR) ||
        RolesUserList.CAJA ||
        RolesUserList.DESARROLLADOR
      ) {
        socket.emit('newOrder', order);
        console.log(
          `Notificación enviada a administrador: ${JSON.stringify(order)}`,
        );
      }
    });
  }
}
