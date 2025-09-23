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
    questionTimes: Array<number> = [];

    constructor(name: string, ws: WebSocket, lobby: Lobby) {
        this.name = name;
        this.ws = ws;
        this.score = 0;
        this.questionStart = 0;
        this.prevQuestionTime = 0;
        this.ID = Lobby.generateKey();
    }

    /** Calculates score and adds it to previous score
     * then resets the time score penalty
     *
     * @param score 
     */
    calculateScore(timer: Timer, correct: boolean, questionNumber: number): void {
        this.questionHistory[questionNumber] = correct;
        this.questionTimes[questionNumber]= timer.getTime() - this.prevQuestionTime;
        if (correct) {
            this.score = this.score + 100 + (900 * ((timer.getTime() - this.prevQuestionTime) / 100));
        }
        this.prevQuestionTime = timer.getTime();
    }


    /**
     * Starts a game by sending the startgame instruction to all players
     */
    startGame(questions: string): void {
        this.ws.send(ApiResponseFactory.startGamePlayerResponse(questions));
    }

    /**
     * Ends game by sending all the required endgame information to the front end then close the websocket.
     *
     * @param sessionLeaderboard
     * @param globalLeaderoard
     * @param time 
     * @param rank
     * @param lobbyRank
     */
    endGame(sessionLeaderboard: string, globalLeaderoard: string, time: string, rank: number, lobbyRank: number): void {
        for (let i = 0; i < this.questionHistory.length; i++) {
            if (this.questionHistory[i] == undefined) {
                this.questionHistory[i] = false;
            }
        }
        let numCorrect: number = this.questionHistory.reduce((count, value) => value ? count + 1 : count, 0);
        this.ws.send(ApiResponseFactory.endGamePlayerResponse(time, numCorrect + '', JSON.stringify(this.questionHistory), sessionLeaderboard, globalLeaderoard, rank, lobbyRank));
        this.ws.close();
    }

    /**
     * Rejoins the player to the game if they refresh the page.
     *
     * @param ws the new websocket for the player.
     * @param questions the players questions.
     */
    rejoin(ws: WebSocket, questions: string | undefined): void {
        this.ws.close();
        this.ws = ws;
        this.ws.send(ApiResponseFactory.playerRejoinResponse(this.name, this.score.toString(), questions));
    }

    getPrevQuestionTime(): number {
        return this.prevQuestionTime;
    }

    setPrevQuestionTime(time: number): void {
        this.prevQuestionTime = time;
    }

    getScore(): number {
        return this.score;
    }

    getName(): string {
        return this.name;
    }

    toJsonString(): string {
        return `{
            "name": "${this.name}",
            "id": "${this.ID}",
            "score": "${this.score}"
        }`;
    }

}
