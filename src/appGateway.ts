import {
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomsService, SocketService } from './shared/services';
import { Players } from "./types";

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() public server: Server;
    private socket: Server = null;
    private logger: Logger = new Logger('AppGateway');

    constructor(private socketService: SocketService,
                private roomsSerivce: RoomsService) {
    }


    afterInit(server: Server) {
        this.socketService.socket = server;
        this.socket = server;
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        this.socket.emit('roomsList', { rooms: this.roomsSerivce.getRooms() });
    }

    @SubscribeMessage('joinRoom')
    handleJoin(@MessageBody() data: Players): void {
        const { playerId, roomId } = data as any;
        const room = this.roomsSerivce.getRoomById(roomId);
        const players = room.registerPlayer(playerId);
        this.socket.emit('playerJoined', players);
    }

}