import { Session } from './Session';
import { Player } from './Player';

export class HostSession extends Session {
    hostId: string;
    players: Player[];

    constructor(ws: WebSocket, lobbyCode: string, hostId: string) {
        super(ws, lobbyCode);
        this.hostId = hostId;
        this.players = [];
    }

    /**
     * Get the players in the session.
     * NOT IMPLEMENTED YET.
     * @returns Promise<Player[]>
     */
    public getPlayers(): Promise<Player[]> {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                type: "getPlayers",
                hostToken: this.hostId
            }));
        });
    }

    /**
     * Start the game for all players.
     * @returns Promise<boolean> True if the game was started successfully, false otherwise.
     */
    public startGame(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                action: "START_GAME",
                hostId: this.hostId,
                data: {
                    lobbyId: this.lobbyCode,
                }
            }));
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "GAME_STARTED") {
                    resolve(true);
                } else {
                    reject(new Error("Failed to start game"));
                }
        }});
    }

    /**
     * Ends the game session for all players.
     * @returns Promise<boolean> True if the session was ended successfully, false otherwise.
     */
    public endSession(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                action: "END_SESSION",
                hostId: this.hostId,
            }));
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "SESSION_ENDED") {
                    resolve(true);
                } else {
                    reject(new Error("Failed to end session"));
                }
            };
        });
    }
}