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
        ws.send(ApiResponseFactory.playerJoinResponse(this.ID));
    }

    getScore(): number {
        return this.score;
    }

    /** Calculates score and adds it to previous score
     * then resets the time score penalty
     * 
     * @param score 
     */
    calculateScore(score: number, timer: Timer): void {
        
        this.score = score + 100 + (900 * (this.prevQuestionTime - timer.getTime())/this.prevQuestionTime);
        this.prevQuestionTime = timer.getTime();
    }

    getName(): string {
        return this.name;
    }

    startGame(questions: string): void {
        this.ws.send(ApiResponseFactory.startGamePlayerResponse(questions));
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
