import { Session } from './Session';
import { Player } from './Player';

export class HostSession extends Session {
    hostToken: string;
    players: Player[];

    constructor(ws: WebSocket, lobbyCode: string, hostToken: string) {
        super(ws, lobbyCode);
        this.hostToken = hostToken;
        this.players = [];
    }
}