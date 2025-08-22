export class Session {
    ws: WebSocket;
    lobbyCode: string;

    constructor(ws: WebSocket, lobbyCode: string) {
        this.ws = ws;
        this.lobbyCode = lobbyCode;
    }

    disconnect(): void {
        if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close();
        }
    }
}