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
import { JoinRoomPayload, Players } from "./types";
import { SendTurnPayload } from "./types/payloads/SendTurnPayload";

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() public server: Server;
    private socket: Server = null;
    private logger: Logger = new Logger('AppGateway');
    private playerMap: Map<string, string>;

    constructor(private socketService: SocketService,
                private roomsSerivce: RoomsService) {
        this.playerMap = new Map();
    }


    afterInit(server: Server) {
        this.socketService.socket = server;
        this.socket = server;
    }

    handleDisconnect(client: Socket) {
        const { id } = client;
        this.logger.log(`Client disconnected: ${id}`);
        const roomId = this.playerMap.get(id);

        if (!roomId) return;

        const players = this.roomsSerivce.unregPlayer(id, roomId);
        this.playerMap.delete(id);
        console.log(this.playerMap);
        this.socket.emit('playersChanged', players);
        this.socket.emit('roomsList', { rooms: this.roomsSerivce.getRooms() });
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        this.socket.emit('roomsList', { rooms: this.roomsSerivce.getRooms() });
    }

    @SubscribeMessage('joinRoom')
    handleJoin(@MessageBody() data: JoinRoomPayload): void {
        const { playerId, roomId } = data;
        const players = this.roomsSerivce.regPlayer(playerId, roomId);
        this.playerMap.set(playerId, roomId);
        console.log(this.playerMap);
        this.socket.emit('playersChanged', players);
    }

    @SubscribeMessage('sendTurn')
    handleTurn(@MessageBody() data: SendTurnPayload): void {
        const { playerId, roomId, turn } = data;
        const room = this.roomsSerivce.makeTurn(playerId, roomId, turn);
    }

}