import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  constructor() {
  }
  public socket: Server = null;

  public joinPlayer(playerId: string, roomId: string) {

  }

}
