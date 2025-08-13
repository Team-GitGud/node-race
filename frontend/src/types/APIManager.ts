class APIManager {
    private static instance: APIManager;
    private apiAddress: string;
    private ws: WebSocket | null = null;
    private lobbyCode: string | null = null;
    private hostToken: string | null = null;

    /** Private constructor to prevent direct instantiation */
    private constructor() {
        // Use VUE_APP_BACKEND_URL from environment variables
        this.apiAddress = process.env.VUE_APP_BACKEND_URL || '';
    }

    /** Static method to get the singleton instance */
    public static getInstance(): APIManager {
        if (!APIManager.instance) {
            APIManager.instance = new APIManager();
        }
        return APIManager.instance;
    }

    public getLobbyCode(): string | null {
        return this.lobbyCode;
    }

    public getHostToken(): string | null {
        return this.hostToken;
    }

    /** Create a new session by calling the backend */
    public async createSession(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const wsProtocol = this.apiAddress.startsWith('https') ? 'wss' : 'ws';
            const wsUrl = this.apiAddress.replace(/^http/, wsProtocol) + '/api/v1/lobby/create';
            const ws = new WebSocket(wsUrl);

            ws.onerror = (err) => {
                reject(new Error('WebSocket connection failed'));
            };
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.lobbyCode && data.hostToken) {
                        this.ws = ws;
                        this.lobbyCode = data.lobbyCode;
                        this.hostToken = data.hostToken;
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } catch (e) {
                    resolve(false);
                }
            }
        });
    }
}

export default APIManager;