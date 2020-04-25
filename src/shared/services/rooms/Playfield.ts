import { FieldUpdatePayload } from 'src/types';
import { Player } from 'src/common/player';

export class Playfield {
    private playfield = {};
    private centerWinPairs = [ [ 1, 9 ], [ 2, 8 ], [ 3, 7 ], [ 4, 6 ] ];
    private topLeftWinPairs = [ [ 2, 3 ], [ 4, 7 ] ];
    private downRightWinPairs = [ [ 4, 6 ], [ 7, 8 ] ];

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
        return this.winCheck(player, big);
    }

    private winCheck(player: Player, big: number): boolean {
        const currentField = Object.values(this.playfield[big]);
        const checked = currentField.filter((owner: Player) => player === owner);
        if (checked.length < 3) return false;
        if (currentField[4] === player) {
            const centerCheck = this.stackCheck(player, this.centerWinPairs, currentField as number[]);
            if (centerCheck) {
                return true;
            }
        }
        if (currentField[0] === player) {
            const leftCheck = this.stackCheck(player, this.topLeftWinPairs, currentField as number[]);
            if (leftCheck) {
                return true;
            }
        }
        if (currentField[0] === player) {
            const rightCheck = this.stackCheck(player, this.downRightWinPairs, currentField as number[]);
            if (rightCheck) {
                return true;
            }
        }

        return false;
    }

    private stackCheck(player: Player, winStack: number[][], field: number[]) {
        let ans = false;
        winStack.forEach((pair: number[]) => {
            const comboResult = this.combosCheck(player, pair, field);
            if (comboResult) {
                ans = true;
            } else {
                return;
            }
        });

        return ans;
    }

    private combosCheck(player: Player, pair: number[], field: number[]) {
        return (field[pair[0] - 1] === player && field[pair[1] - 1] === player) ? true : false;
    }
}