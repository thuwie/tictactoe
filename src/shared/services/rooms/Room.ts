import { RoomStatus } from '../../../common/roomStatus';
import { AppGateway } from "../../../appGateway";
import { Playfield } from "./Playfield";

type Players
{
    first: string;
    second: string;
};

export class Room {
    private readonly roomId: string;
    private roomStatus: RoomStatus;
    private turnsCount: number;
    private players: object;
    private playfield: Playfield;

    constructor(id: string) {
        this.roomId = id;
        this.roomStatus = RoomStatus.CREATED;
        this.turnsCount = 0;
        this.players = { first: null, second: null };
        this.playfield = new Playfield();
    }

    public registerPlayer(playerId: string): object {
        if (!this.players.first) {
            this.players.first = playerId;
        }
        if (!this.players.second) {
            this.players.second = playerId;
        }

        return this.players;
    }

    public start(): void {

    }

    public kill(): void {

    }

    public info(): string {
        return `Room ID: ${this.id} | Status: ${this.getReadableStatus()}`;
    }


    private getReadableStatus() {
        switch (this.roomStatus) {
            case 0:
                return 'Waiting for the opponent';
            case 1:
                return 'Preparing';
            case 2:
                return 'In game';
            case 3:
                return 'Finished';
        }
    }

    get id(): string {
        return this.roomId;
    }

    get status(): RoomStatus {
        return this.roomStatus;
    }

    set status(value) {
        this.roomStatus = value;
    }
}