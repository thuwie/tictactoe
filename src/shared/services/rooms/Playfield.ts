import { FieldUpdatePayload } from 'src/types';
import { Player } from 'src/common/player';

export class Playfield {
    private playfield = {};

    constructor() {
        this.generateField(3);
    }

    private generateField(n: number) {
        for (let i = 1; i < n * n + 1; i++) {
            this.playfield[i] = {};
            for (let j = 1; j < n * n + 1; j++) {
                this.playfield[i][j] = Player.none;
            }
        }
    }

    get field() {
        return this.playfield;
    }

    public updateField(player: Player, payload: FieldUpdatePayload): boolean {
        const { big, short } = payload;
        this.playfield[big][short] = player;
        return this.winCheck();
    }

    private winCheck(): boolean {
        let playerA = 0, playerB = 0;
        Object.values(this.playfield).forEach((player: Player) => {
            if (player === Player.first) playerA++;
            if (player === Player.second) playerB++;
        });

        if (playerA < 3 && playerB < 3) return false;
        return false;
    }
}