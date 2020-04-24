import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Room } from './Room';
import { RoomStatus } from '../../../common/roomStatus';
// do not change it to the '..', it will break the injection. the weirdest thing eva.
import { SocketService } from '../socket/socket.service';

@Injectable()
export class RoomsService {
  private readonly rooms: Map<string, Room>;
  private readonly logger = new Logger();

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

  cleanUp(id?: string): number {
    if (id) {
      const room = this.getRoomById(id);
      room.kill();
      return 1;
    } else {
      const rooms = this.getRooms(RoomStatus.ABANDONED);
      rooms.forEach((room: Room) => {
        room.kill();
        this.rooms.delete(room.id);
      });
      return rooms.length;
    }
    // TODO socket send update
  }

  @Cron('1 */1 * * * *')
  sweepUp() {
    const cleanedAmount = this.cleanUp();
    this.logger.log(`${cleanedAmount} were swept`);
  }

  @Cron('1 */1 * * * *')
  roomStats() {
    const rooms = this.getRooms();
    rooms.forEach((room) => this.logger.log(room.info()));
  }
}