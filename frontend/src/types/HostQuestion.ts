export class HostQuestion {
    id: number;
    title: string;
    averageAnswerTime: number;
    correctAnswerCount: number;
    incorrectAnswerCount: number;

    constructor(id: number, title: string, averageAnswerTime: number, correctAnswerCount: number, incorrectAnswerCount: number, unansweredCount: number) {
        this.id = id;
        this.title = title;
        this.averageAnswerTime = averageAnswerTime;
        this.correctAnswerCount = correctAnswerCount;
        this.incorrectAnswerCount = incorrectAnswerCount;
    }
}