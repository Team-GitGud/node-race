import { Session } from './Session';
import { Player } from './Player';
import { Question } from './Question';
import { QuestionAdapter, BackendQuestion } from './QuestionAdapter';

export class PlayerSession extends Session {
    private player: Player;
    private questions: Array<Question>;

    public constructor(ws: WebSocket, lobbyCode: string, playerId: string, nickname: string, questions: Array<Question>) {
        super(ws, lobbyCode);
        this.player = new Player(playerId, nickname);
        this.questions = questions;
        
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
        console.log("Player session questions:", this.questions);
    }

    public handlePlayerKicked(reason: string) {
        console.log("Player kicked with reason:", reason);
    }

    public getQuestions(): Array<Question> {
        return this.questions;
    }
}