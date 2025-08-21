import { Session } from './Session';
import { PlayerSession } from './PlayerSession';
import { HostSession } from './HostSession';

class APIManager {
    private static instance: APIManager;
    private apiAddress: string;
    private session: Session | null = null;

    private constructor() {
        this.apiAddress = process.env.VUE_APP_BACKEND_URL || '';
        console.log("Address:", this.apiAddress);
    }

    public static getInstance(): APIManager {
        if (!APIManager.instance) {
            APIManager.instance = new APIManager();
        }
        return APIManager.instance;
    }

    public getSession(): Session | null {
        return this.session;
    }

    public async createSession(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const wsProtocol = this.apiAddress.startsWith('https') ? 'wss' : 'ws';
            const wsUrl = this.apiAddress.replace(/^http/, wsProtocol) + '/api/v1/lobby/create';
            const ws = new WebSocket(wsUrl);

            ws.onerror = () => reject(new Error('WebSocket connection failed'));
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.lobbyCode && data.hostToken) {
                        this.session = new HostSession(ws, data.lobbyCode, data.hostToken);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } catch {
                    resolve(false);
                }
            };
        });
    }

    public async joinSession(lobbyCode: string, playerName: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const wsProtocol = this.apiAddress.startsWith('https') ? 'wss' : 'ws';
            const wsUrl = `${this.apiAddress.replace(/^http/, wsProtocol)}/api/v1/lobby/join?lobbyID=${encodeURIComponent(lobbyCode)}&name=${encodeURIComponent(playerName)}`;
            const ws = new WebSocket(wsUrl);

            ws.onerror = () => reject(new Error('WebSocket connection failed'));
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.playerId) {
                        this.session = new PlayerSession(ws, lobbyCode, data.playerId, playerName);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } catch {
                    resolve(false);
                }
            };
        });
    }
}

export default APIManager;