import { WebSocket } from 'ws';

export class Player {
    name: string;
    ip: string;
    score: number;
    questionStart: number;
    prevQuestionTime: number;

    constructor(name: string, ip: string) {
        this.name = name;
        this.ip = ip;
        this.score = 0;
        this.questionStart = 0;
        this.prevQuestionTime = 0;
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
