import { WebSocket } from 'ws';
import { Lobby } from './lobby';
import { ApiResponseFactory } from '../api/apiResponseFactory';
import { Timer } from "./timer";

export class Player {
    name: string;
    ID: string;
    ws: WebSocket;
    score: number;
    questionStart: number;
    prevQuestionTime: number;
    questionHistory: Array<Boolean> = [];

    constructor(name: string, ws: WebSocket, lobby: Lobby) {
        this.name = name;
        this.ws = ws;
        this.score = 0;
        this.questionStart = 0;
        this.prevQuestionTime = 0;
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
    calculateScore(timer: Timer, correct: boolean): void {
        if (correct) {
            this.score = this.score + 100 + (900 * ((timer.getTime() - this.prevQuestionTime) / 100));
        }
        this.prevQuestionTime = timer.getTime();
    }

    getName(): string {
        return this.name;
    }

    startGame(questions: string): void {
        this.ws.send(ApiResponseFactory.startGamePlayerResponse(questions));
    }

    endGame(sessionLeaderboard: string, globalLeaderoard: string, time: string): void {
        let numCorrect: number = this.questionHistory.reduce((count, value) => value ? count + 1 : count, 0);
        this.ws.send(ApiResponseFactory.endGamePlayerResponse(time, numCorrect + '', JSON.stringify(this.questionHistory), sessionLeaderboard, globalLeaderoard));
        this.ws.close();
    }
    //static endGamePlayerResponse(time: string, numCorrect: string, answer: string, sessLeaderboard: string, globalLeaderoard: string): string {

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
