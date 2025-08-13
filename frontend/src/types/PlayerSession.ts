import { Session } from './Session';
import { Player } from './Player';

export class PlayerSession extends Session {
    player: Player;

    constructor(ws: WebSocket, lobbyCode: string, playerId: string, nickname: string) {
        super(ws, lobbyCode);
        this.player = new Player(playerId, nickname);
    }

    getPlayer(): Player {
        return this.player;
    }
}