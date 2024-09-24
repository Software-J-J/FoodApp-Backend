import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}
  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      //cuando se conecta el cliente
      console.log('Cliente conectado', socket.id);

      socket.on('disconnect', () => {
        console.log('Cliente Desconectado', socket.id);
      });
    });
  }
}
