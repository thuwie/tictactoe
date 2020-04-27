import { RoomStatus } from '../../../common/roomStatus';
import { Playfield } from "./Playfield";
import { Players } from "../../../types";
import { Turn } from "../../../types/Turn";
import { OnTurnUpdate } from "../../../types/OnTurnUpdate";
import { Player } from "../../../common/player";

export class Room {
    private readonly roomId: string;
    private roomStatus: RoomStatus;
    private turnsCount: number;
    private players: Players;
    private activePlayer: string;
    private playfield: Playfield;

    constructor(id: string) {
        this.roomId = id;
        this.roomStatus = RoomStatus.CREATED;
        this.turnsCount = 0;
        this.players = { first: null, second: null, spectators: [] };
        this.playfield = new Playfield();
        this.activePlayer = null;
    }

    public registerPlayer(playerId: string): string {
        if (this.roomStatus === RoomStatus.FINISHED || this.roomStatus === RoomStatus.ABANDONED) return '';

        if (!this.players.first) {
            this.players.first = playerId;
            this.activePlayer = playerId;
        } else {
            if (!this.players.second) {
                this.players.second = playerId;
                this.roomStatus = RoomStatus.STARTED;
            } else {
                this.players.spectators.push(playerId);
            }
        }
        return this.getReadablePlayers();
    }

    public unregisterPlayer(playerId: string): string {
        if (this.players.first === playerId) {
            this.players.first = null;
            this.roomStatus = RoomStatus.ABANDONED;
            return this.getReadablePlayers();
        }
        if (this.players.second === playerId) {
            this.players.second = null;
            this.roomStatus = RoomStatus.ABANDONED;
            return this.getReadablePlayers();
        }
        this.players.spectators = this.players.spectators.filter((player) => player !== playerId);
        return this.getReadablePlayers();
    }

    public makeTurn(playerId: string, turn: Turn): OnTurnUpdate | null {
        const player = this.authorizePlayer(playerId);
        if (!player) return null;

        const win = this.playfield.updateField(player, turn);

        if (!win) this.changeTurn(playerId);
        return {
            win,
            activePlayer: this.activePlayer,
            playfield: this.playfield.field as any,
            turnsCount: this.turnsCount
        };
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
                return 'In game';
            case 2:
                return 'Finished';
            case 3:
                return 'Abandoned';
        }
    }

    private getReadablePlayers(): string {
        const { first, second, spectators } = this.players;
        return `${first} vs. ${second}. ${spectators.length} watching: ${spectators.toString()}`;
    }

    private authorizePlayer(playerId: string): Player | null {
        if (playerId === this.players.first) return Player.first;
        if (playerId === this.players.second) return Player.second;
        return null;
    }

    private changeTurn(playerId: string): void {
        this.turnsCount++;
        if (playerId === this.players.first) {
            this.activePlayer = this.players.second;
        } else {
            this.activePlayer = this.players.first;
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