import { Session } from './Session';
import { Player } from './Player';
import { Question } from './Question';
import { QuestionAdapter, BackendQuestion } from './QuestionAdapter';

export class HostSession extends Session {
    hostId: string;
    players: Player[];

    constructor(ws: WebSocket, lobbyCode: string, hostId: string) {
        super(ws, lobbyCode);
        this.hostId = hostId;
        this.players = [];

        // Set up event listeners for incoming messages
        this.addEventListener("GAME_STARTED_HOST", (data) => {
            this.handleGameStarted(data.questions);
        });
        
        this.addEventListener("SESSION_ENDED", (data) => {
            this.handleSessionEnded(data.reason);
        });
    }

    public handleGameStarted(questions: BackendQuestion[]) {
        if (questions !== undefined && questions.length > 0) {
            // If there's no players, for some reason there's no questions generated.
            const adaptedQuestions = QuestionAdapter.fromBackendQuestions(questions);
            console.log("Adapted questions:", adaptedQuestions);
        }
    }

    public handleSessionEnded(reason: string) {
        console.log("Session ended with reason:", reason);
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
            resolve(true);
        });
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
            resolve(true);
        });
    }
}