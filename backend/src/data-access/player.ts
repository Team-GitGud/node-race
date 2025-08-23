import { WebSocket } from 'ws';
import { Lobby } from './lobby';
import { ApiResponseFactory } from '../api/apiResponseFactory';
import {Timer} from "./timer";

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
        this.prevQuestionTime = 360;
        this.ID = Lobby.generateKey();
    }

    getScore(): number {
        return this.score;
    }

    /** Calculates score and adds it to previous score
     * then resets the time score penalty
     * 
     * @param score 
     */
    calculateScore(timer: Timer, correct: boolean ): void {
        if (correct){
            this.score = this.score + 100 + (900 * (this.prevQuestionTime - timer.getTime())/this.prevQuestionTime);
        }
        this.prevQuestionTime = timer.getTime();
    }

    getName(): string {
        return this.name;
    }

    startGame(questions: string): void {
        this.ws.send(ApiResponseFactory.startGamePlayerResponse(questions));
    }

    endGame(): void {
        this.ws.close();
        return;
    }

    getPrevQuestionTime(): number {
        return this.prevQuestionTime;
    }

    setPrevQuestionTime(time: number): void {
        this.prevQuestionTime = time;
    }

    rejoin(ws: WebSocket, questions: string | undefined): void {
        this.ws.close();
        this.ws = ws;
        this.ws.send(ApiResponseFactory.playerRejoinResponse(this.name, this.score.toString(), questions));
    }

    toJsonString(): string {
        return JSON.stringify(`
        {
            "name": "${this.name}",
            "id": "${this.ID}",
            "score": "${this.score}"
        }
        `);
    }

}
