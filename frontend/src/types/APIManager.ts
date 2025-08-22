import { Session } from './Session';
import { PlayerSession } from './PlayerSession';
import { HostSession } from './HostSession';
import { ref, Ref } from 'vue';

class APIManager {
    private static instance: APIManager;
    private apiAddress: string;
    private session: Session | null = null;
    private isLoading: Ref<boolean> = ref(false);
    private loadingStartedAt: number | null = null;
    private minLoadingDuration = 500; // milliseconds

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

    private startLoading() {
        this.loadingStartedAt = Date.now();
        this.isLoading.value = true;
    }

    private stopLoading() {
        if (this.loadingStartedAt === null) {
            this.isLoading.value = false;
            return;
        }
        const elapsed = Date.now() - this.loadingStartedAt;
        const remaining = this.minLoadingDuration - elapsed;
        if (remaining > 0) {
            setTimeout(() => {
                this.isLoading.value = false;
                this.loadingStartedAt = null;
            }, remaining);
        } else {
            this.isLoading.value = false;
            this.loadingStartedAt = null;
        }
    }

    public async createSession(): Promise<boolean> {
        this.startLoading();
        return new Promise((resolve, reject) => {
            const wsProtocol = this.apiAddress.startsWith('https') ? 'wss' : 'ws';
            const wsUrl = this.apiAddress.replace(/^http/, wsProtocol) + '/api/v1/lobby/create';
            const ws = new WebSocket(wsUrl);

            ws.onerror = () => reject(new Error('WebSocket connection failed'));
            ws.onmessage = (event) => {
                this.stopLoading();
                try {
                    let data = JSON.parse(event.data);
                    // Parse differently if data is a string.
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
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
        this.startLoading();
        return new Promise((resolve, reject) => {
            const wsProtocol = this.apiAddress.startsWith('https') ? 'wss' : 'ws';
            const wsUrl = `${this.apiAddress.replace(/^http/, wsProtocol)}/api/v1/lobby/join?lobbyID=${encodeURIComponent(lobbyCode)}&name=${encodeURIComponent(playerName)}`;
            const ws = new WebSocket(wsUrl);

            ws.onerror = () => reject(new Error('WebSocket connection failed'));
            ws.onmessage = (event) => {
                this.stopLoading();
                try {
                    let data = JSON.parse(event.data);
                    // Parse differently if data is a string.
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                    if (data.playerId) {
                        this.session = new PlayerSession(ws, lobbyCode, data.playerId, playerName, []);
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

    public async healthCheck(): Promise<boolean> {
        try {
            const res = await fetch(`${this.apiAddress}/health`);
            return res.ok;
        } catch {
            return false;
        } finally {
            console.log('Health check completed');
        }
    }

    public getIsLoading(): Ref<boolean> {
        return this.isLoading;
    }
}

export default APIManager;