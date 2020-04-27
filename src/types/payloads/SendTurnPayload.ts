import { Turn } from "../Turn";

export type SendTurnPayload = {
    playerId: string;

    roomId: string;

    turn: Turn;
};
