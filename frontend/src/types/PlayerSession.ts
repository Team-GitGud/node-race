import { Session } from './Session';

export class PlayerSession extends Session {
    playerId: string;

    constructor(ws: WebSocket, lobbyCode: string, playerId: string) {
        super(ws, lobbyCode);
        this.playerId = playerId;
    }
}