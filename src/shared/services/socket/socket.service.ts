import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Room } from '../rooms/Room';

@Injectable()
export class SocketService {
    constructor() {
    }

    public socket: Server = null;

    public cleanUp(rooms: Room[]) {
        this.socket.emit('roomsList', { rooms });
    }

    public updateField(playfield, activePlayer, turn) {
        this.socket.emit('getTurn', { playfield, activePlayer, turn });
    }

    public endGame(playfield, activePlayer, turn) {
        this.socket.emit('endgame', { playfield, activePlayer, turn });
    }
}
