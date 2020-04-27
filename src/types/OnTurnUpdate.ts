import { Playfield } from "../shared/services/rooms/Playfield";

export type OnTurnUpdate = {
    win: boolean;

    activePlayer: string;

    playfield: Playfield;

    turnsCount: number;
};
