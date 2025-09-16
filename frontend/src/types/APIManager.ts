import { Session } from './Session';
import { PlayerSession } from './PlayerSession';
import { HostSession } from './HostSession';
import { ref, Ref } from 'vue';

class APIManager {
    private static instance: APIManager;
    private apiAddress: string;
    private session: Session | null = null;

    // Loading state management
    private isLoading: Ref<boolean> = ref(false);
    private loadingStartedAt: number | null = null;
    private minLoadingDuration = 500; // milliseconds

    // Session keys for localStorage
    private static HOST_SESSION_KEY = 'nodeRaceHostSession';
    private static PLAYER_SESSION_KEY = 'nodeRacePlayerSession';

    /** Private constructor to force singleton design pattern */
    private constructor() { 
        this.apiAddress = process.env.VUE_APP_BACKEND_URL || '';
    }

    /** Get current instance, or create new instance, of APIManager */
    public static getInstance(): APIManager {
        if (!APIManager.instance) { APIManager.instance = new APIManager(); }
        return APIManager.instance;
    }

    /** Get the current host or player session */
    public async getSession(): Promise<Session | null> {
        if (this.session) { return this.session; }
        // Get current route
        const page = window.location.pathname;
        if (page === '/host') {
            const success = await this.reconnectSession("host");
            if (!success) {
                this.stopLoading();
                return null
            }
        } else if (
            page === '/lobby' ||
            page === '/question-navigation' ||
            page.startsWith('/question/') ||
            page === '/leaderboard'
        ) {
            const success = await this.reconnectSession("player");
            if (!success) {
                this.stopLoading();
                return null;
            }
        }
        return this.session;
    }

    /** Set loading to true and note when loading started */
    private startLoading() {
        this.loadingStartedAt = Date.now();
        this.isLoading.value = true;
    }

    /** Stop loading, ensuring atleast minimum loading duration has passed */
    private stopLoading() {
        if (this.loadingStartedAt === null) {
            this.isLoading.value = false;
            return;
        }
        // Calculate elapsed time and determine if we need to wait to stop loading
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

    /** Get WebSocket protocol based on API address */
    private createWs(endpoint: string, resolve: (value: boolean) => void, role:"host"|"player"): WebSocket {
        const wsProtocol = this.apiAddress.startsWith('https') ? 'wss' : 'ws';
        const wsUrl = `${this.apiAddress.replace(/^https?/, wsProtocol)}/api/v1/${endpoint}`;
        const ws = new WebSocket(wsUrl);
        ws.onerror = () => {
            this.clearSession(role);
            this.stopLoading();
            resolve(false);
        };
        return ws;
    }

    /** Parse WebSocket message to JSON */
    private parseWsMsg(event: MessageEvent<any>, resolve: (value: boolean) => void): any {
        try {
            let data = JSON.parse(event.data);
            // Parse differently if data is a string.
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            return data;
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            this.stopLoading();
            resolve(false);
        }
    }

    /** Create new session, sending request to backend */
    public createSession(): Promise<boolean> {
        this.startLoading();
        return new Promise((resolve) => {
            const ws = this.createWs('lobby/create', resolve, "host");
            ws.onmessage = (event) => {
                this.stopLoading();
                const { lobbyCode, hostToken } = this.parseWsMsg(event, resolve);
                if (!lobbyCode || !hostToken) { return resolve(false); }

                this.session = new HostSession(ws, lobbyCode, hostToken);
                this.saveSessionInfo({ lobbyCode, hostToken }, "host");
                this.setupSessionMessageHandler(ws);
                resolve(true);
            };
        });
    }

    /** Join session, sending request to backend */
    public joinSession(lobbyCode: string, playerName: string): Promise<boolean> {
        this.startLoading();
        return new Promise((resolve) => {
            const ws = this.createWs(`lobby/join?lobbyId=${encodeURIComponent(lobbyCode)}&name=${encodeURIComponent(playerName)}`,
                resolve, "player");
            ws.onmessage = (event) => {
                this.stopLoading();
                const { playerId } = this.parseWsMsg(event, resolve);
                if (!playerId) { return resolve(false); }

                this.session = new PlayerSession(ws, lobbyCode, playerId, playerName, []);
                this.saveSessionInfo({ lobbyCode, playerId, playerName }, "player");
                this.setupSessionMessageHandler(ws);
                resolve(true);
            };
        });
    }

    /** Check backend for health check and return response */
    public async healthCheck(): Promise<boolean> {
        let res;
        try { res = await fetch(`${this.apiAddress}/health`); }
        catch { return false; }
        return res.ok;
    }

    /** Get loading state */
    public getIsLoading(): Ref<boolean> { return this.isLoading; }

    public setIsLoading(value: boolean) { this.isLoading.value = value; }

    /** Save session info to localStorage */
    private saveSessionInfo(info: any, role: "host" | "player") {
        const key = role === "host" ? APIManager.HOST_SESSION_KEY : APIManager.PLAYER_SESSION_KEY;
        localStorage.setItem(key, JSON.stringify(info));
    }

    /** Load session info from localStorage */
    private loadSessionInfo(role: "host" | "player"): any | null {
        const key = role === "host" ? APIManager.HOST_SESSION_KEY : APIManager.PLAYER_SESSION_KEY;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    /** Clear session info from localStorage */
    private clearSessionInfo(role?: "host" | "player") {
        if (!role) {
            localStorage.removeItem(APIManager.HOST_SESSION_KEY);
            localStorage.removeItem(APIManager.PLAYER_SESSION_KEY);
        } else {
            const key = role === "host" ? APIManager.HOST_SESSION_KEY : APIManager.PLAYER_SESSION_KEY;
            localStorage.removeItem(key);
        }
    }

    /** Clears the current session and localStorage for the given role */
    public clearSession(role?: "host" | "player") {
        this.session = null;
        this.clearSessionInfo(role);
    }

    /**
     * Attempt to reconnect using saved session info.
     * Returns true if reconnection is successful.
     */
    public reconnectSession(role: "host" | "player"): Promise<boolean> {
        this.startLoading();
        return new Promise((resolve) => {
            const info = this.loadSessionInfo(role);
            if (!info) { 
                this.stopLoading();
                return resolve(false); 
            }

            const ws = this.createWs(role === "host" ? `lobby/rejoin?id=${encodeURIComponent(info.hostToken)}&lobbyId=${encodeURIComponent(info.lobbyCode)}` : 
                `lobby/rejoin?id=${encodeURIComponent(info.playerId)}&lobbyId=${encodeURIComponent(info.lobbyCode)}`,
                resolve, role);
            ws.onmessage = (event) => {
                this.stopLoading();
                const { questions } = this.parseWsMsg(event, resolve);
                if (role === "host") { this.session = new HostSession(ws, info.lobbyCode, info.hostToken); }
                else { this.session = new PlayerSession(ws, info.lobbyCode, info.playerId, info.playerName, questions); }
                this.setupSessionMessageHandler(ws);
                resolve(true);
            };
        });
    }

    /**
     * Sets up a persistent WebSocket message handler that routes messages to the current session's EventListener system
     */
    private setupSessionMessageHandler(ws: WebSocket) {
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                // Parse differently if data is a string
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }
                // Route the message to the session's EventListener system
                if (this.session && data.type) {
                    this.session.emitEvent(data.type, data);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
    }
}

export default APIManager;