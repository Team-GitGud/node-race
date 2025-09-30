import { Session } from './Session';
import { PlayerSession } from './PlayerSession';
import { HostSession } from './HostSession';
import { GameTimer } from './GameTimer';
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
            console.error('WebSocket message:', event.data);
            this.stopLoading();
            resolve(false);
            return undefined;
        }
    }

    /** Create new session, sending request to backend */
    public createSession(): Promise<boolean> {
        // Clear any existing session-specific data when creating a new session
        localStorage.removeItem('host-session-data');
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
                const parsedData = this.parseWsMsg(event, resolve);
                if (!parsedData || !parsedData.playerId) { return resolve(false); }
                const { playerId } = parsedData;

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

    /** Save game over state to localStorage */
    public saveGameOverState(gameOver: boolean) {
        const info = this.loadSessionInfo("player");
        if (info) {
            info.gameOver = gameOver;
            this.saveSessionInfo(info, "player");
        }
    }

    /** Update player session data in localStorage (for gameTimer, answers, etc.) */
    public updatePlayerSessionData(sessionData: any) {
        this.saveSessionInfo(sessionData, "player");
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
     * Returns true if reconnection is successful (or if offline session created for ended game).
     */
    public reconnectSession(role: "host" | "player"): Promise<boolean> {
        this.startLoading();
        return new Promise((resolve) => {
            const info = this.loadSessionInfo(role);
            if (!info) { 
                this.stopLoading();
                return resolve(false); 
            }

            // For hosts, check if game has ended - create offline session instead of reconnecting
            if (role === "host") {
                const hostSessionData = localStorage.getItem('host-session-data');
                if (hostSessionData) {
                    try {
                        const data = JSON.parse(hostSessionData);
                        if (data.gameEnded === true) {
                            // Game ended - create offline session (no WebSocket connection needed)
                            const offlineWs = {
                                send: () => { /* offline mode - no messages to send */ },
                                close: () => { /* offline mode - no connection to close */ },
                                readyState: WebSocket.CLOSED
                            } as unknown as WebSocket;
                            this.session = new HostSession(offlineWs, info.lobbyCode, info.hostToken);
                            this.stopLoading();
                            return resolve(true);
                        }
                    } catch (e) {
                        // If parsing fails, continue with normal reconnection
                    }
                }
            }

            // For players, check if game is over - don't attempt reconnection
            if (info.gameOver) {
                this.stopLoading();
                console.log("Game is over, skipping reconnection");
                return resolve(false);
            }

            const ws = this.createWs(role === "host" ? `lobby/rejoin?id=${encodeURIComponent(info.hostToken)}&lobbyId=${encodeURIComponent(info.lobbyCode)}` : 
                `lobby/rejoin?id=${encodeURIComponent(info.playerId)}&lobbyId=${encodeURIComponent(info.lobbyCode)}`,
                resolve, role);
            ws.onmessage = (event) => {
                this.stopLoading();
                const parsedData = this.parseWsMsg(event, resolve);
                
                // Check if parsing was successful
                if (!parsedData) {
                    console.log('Failed to parse WebSocket message during rejoin');
                    return resolve(false);
                }
                
                const { questions } = parsedData;
                
                if (role === "host") { 
                    this.session = new HostSession(ws, info.lobbyCode, info.hostToken); 
                } else { 
                    // Ensure questions is an array, default to empty array if not provided
                    const questionsArray = Array.isArray(questions) ? questions : [];
                    const playerSession = new PlayerSession(ws, info.lobbyCode, info.playerId, info.playerName, questionsArray);
                    this.session = playerSession;

                    // If there's a game timer, we can assume there's questions and answers. 
                    if (info.gameTimer) {
                        const restoredTimer = GameTimer.fromJSON(info.gameTimer);
                        playerSession.setGameTimer(restoredTimer);
                        playerSession.setAnswers(info.answers);
                        playerSession.setAnswerTime(info.answerTimes);
                    }
                }
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
                console.log("Received message", data);
                // Route the message to the session's EventListener system
                if (this.session && data.type) {
                    this.session.emitEvent(data.type, data);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
                console.error('WebSocket message:', event.data);
            }
        };
    }
}

export default APIManager;