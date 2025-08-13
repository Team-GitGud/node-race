import { WebSocket } from 'ws';
import { Lobby } from './lobby';
import { ApiResponseFactory } from '../api/apiResponseFactory';

export class Player {
    name: string;
    ID: string;
    ws: WebSocket;
    score: number;
    questionStart: number;
    prevQuestionTime: number;

    constructor(name: string, ws: WebSocket) {
        this.name = name;
        this.ws = ws;
        this.score = 0;
        this.questionStart = 0;
        this.prevQuestionTime = 0;
        this.ID = Lobby.generateKey();
        ws.send(ApiResponseFactory.playerJoinResponse(this.ID));
    }

    getScore(): number {
        return this.score;
    }

    setScore(score: number): void {
        this.score = score;
    }

    getName(): string {
        return this.name;
    }

    startGame(): void {
        return;
    }

    endGame(): void {
        return;
    }

    getPrevQuestionTime(): number {
        return this.prevQuestionTime;
    }

    setPrevQuestionTime(time: number): void {
        this.prevQuestionTime = time;
    }
}
