import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Room } from './Room';
import { RoomStatus } from '../../../common/roomStatus';
// do not change it to the '..', it will break the injection. the weirdest thing eva.
import { SocketService } from '../socket/socket.service';
import { Turn } from 'src/types/Turn';

@Injectable()
export class RoomsService {
    private readonly rooms: Map<string, Room>;
    private readonly logger = new Logger();

    constructor(private socketService: SocketService) {
        this.rooms = new Map();
    }

    create(): string {
        const id = [ ...Array(10) ].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        this.rooms.set(id, new Room(id));
        this.socketService.socket.emit('roomsList', { rooms: this.getRooms() });
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
        return this.rooms.get(id);
    }

    cleanUp(id?: string): number {
        let cleanedUp: number = 0;
        if (id) {
            const room = this.getRoomById(id);
            room.kill();
            cleanedUp = 1;
        } else {
            const rooms = this.getRooms(RoomStatus.ABANDONED);
            rooms.forEach((room: Room) => {
                room.kill();
                this.rooms.delete(room.id);
            });
            cleanedUp = rooms.length;
        }
        this.socketService.cleanUp(this.getRooms());
        return cleanedUp;
    }

    regPlayer(playerId, roomId): string {
        const room = this.getRoomById(roomId);
        const players = room.registerPlayer(playerId);
        return players;
    }

    unregPlayer(playerId, roomId): string {
        const room = this.getRoomById(roomId);
        if (room) return room.unregisterPlayer(playerId);
    }

    makeTurn(playerId: string, roomId: string, turn: Turn): any {
        const room = this.getRoomById(roomId);
        const { win, playfield, activePlayer, turnsCount } = room.makeTurn(playerId, turn);

        if (!win) {
            this.socketService.updateField(playfield, activePlayer, turnsCount);
        } else {
            this.socketService.endGame(playfield, activePlayer, turnsCount);
        }
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