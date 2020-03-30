import { Injectable } from '@nestjs/common';
import { Room } from './Room';
import { RoomStatus } from '../../../common/roomStatus';
// do not change it to the '..', it will break the injection. the weirdest thing eva.
import { SocketService } from '../socket/socket.service';

@Injectable()
export class RoomsService {
  private readonly rooms: Map<string, Room>;

  constructor(private socketService: SocketService) {
    this.rooms = new Map();
  }

  create(): string {
    const id = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
    this.rooms.set(id, new Room(id));
    this.socketService.socket.emit('roomsList', {rooms: this.getRooms()});
    return id;
  }

  getRooms(status?: RoomStatus): Room[] {
    if (status) {
      return Array.from(this.rooms.values()).filter((room: Room) => status === room.status);
    } else {
      return Array.from(this.rooms.values());
    }
  }

  getRoomById(id: string): Room {
    return Array.from(this.rooms.values()).find((room: Room) => id === room.id);
  }

  cleanUp(id?: string): void {
    if (id) {
      const room = this.getRoomById(id);
      room.kill();
    } else {
      const rooms = this.getRooms(RoomStatus.ABANDONED);
      rooms.forEach((room: Room) => room.kill());
    }
    // TODO socket send update
  }
}