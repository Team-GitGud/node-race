import { Session } from './Session';
import { Player } from './Player';
import { Question } from './Question';

export class PlayerSession extends Session {
    private player: Player;
    private questions: Array<Question>;

    public constructor(ws: WebSocket, lobbyCode: string, playerId: string, nickname: string, questions: Array<Question>) {
        super(ws, lobbyCode);
        this.player = new Player(playerId, nickname);
        this.questions = questions;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getQuestions(): Array<Question> {
        return this.questions;
    }
}