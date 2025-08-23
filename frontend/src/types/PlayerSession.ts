import { Session } from './Session';
import { Player } from './Player';
import { Question } from './Question';
import { QuestionAdapter, BackendQuestion } from './QuestionAdapter';
import { InactivityChecker } from './InactivityChecker';
import APIManager from './APIManager';
import { GameTimer } from './GameTimer';

export class PlayerSession extends Session {
    private player: Player;
    private questions: Array<Question>;
    private answers: Array<boolean>;
    private gameTimer: GameTimer | null = null;
    private inactivityChecker: InactivityChecker | null = null;

    public constructor(ws: WebSocket, lobbyCode: string, playerId: string, nickname: string, questions: Array<BackendQuestion>) {
        super(ws, lobbyCode);
        this.player = new Player(playerId, nickname);
        this.questions = QuestionAdapter.fromBackendQuestions(questions);
        this.answers = new Array(questions.length).fill(undefined); // All questions are incorrect by default.
        
        // Set up event listeners for incoming messages
        this.addEventListener("GAME_STARTED", (data) => {
            this.handleGameStarted(data.questions);
        });
        
        this.addEventListener("PLAYER_KICKED", (data) => {
            this.handlePlayerKicked(data.reason);
        });
    }

    public getPlayer(): Player {
        return this.player;
    }

    public handleGameStarted(questions: BackendQuestion[]) {
        this.questions = QuestionAdapter.fromBackendQuestions(questions);
        // TODO: Handle game started for Player Session.
        console.log("Game started with questions:", questions);

        // Start inactivity checker when game starts
        if (this.inactivityChecker) {
            this.inactivityChecker.stop();
        }
        this.inactivityChecker = new InactivityChecker();
        this.inactivityChecker.start();
    }

    public handlePlayerKicked(reason: string) {
        console.log("Player kicked with reason:", reason);
        
        if (this.inactivityChecker) {
            this.inactivityChecker.stop();
            this.inactivityChecker = null;
        }
    }

    public getQuestions(): Array<Question> {
        return this.questions;
    }

    public getAnswers(): Array<boolean> {
        return this.answers;
    }

    public addAnswer(questionIndex: number, answer: boolean) {
        this.answers[questionIndex] = answer;
    }
    /**
     * Leaves the session: disconnects the WebSocket and cleans up.
     * TODO: Send a message to the backend to notify leaving the lobby.
     */
    public leaveSession() {
        // TODO: Send a "LEAVE_LOBBY" message to the backend if needed
        // Example: this.ws.send(JSON.stringify({ type: "LEAVE_LOBBY" }));

        if (this.inactivityChecker) {
            this.inactivityChecker.stop();
            this.inactivityChecker = null;
        }

        // Disconnect the WebSocket
        this.disconnect();

        // Optionally, clean up session in APIManager
        APIManager.getInstance().clearSession();
    }

    public setGameTimer(gameTimer: GameTimer) {
        this.gameTimer = gameTimer;
    }

    public getGameTimer(): GameTimer | null {
        return this.gameTimer;
    }
}