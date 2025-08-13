import { Session } from './Session';

export class HostSession extends Session {
    hostToken: string;

    constructor(ws: WebSocket, lobbyCode: string, hostToken: string) {
        super(ws, lobbyCode);
        this.hostToken = hostToken;
    }
}