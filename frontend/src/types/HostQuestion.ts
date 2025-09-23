export class HostQuestion {
    private id: number;
    private title: string;
    private averageAnswerTime: number;
    private correctAnswerCount: number;
    private incorrectAnswerCount: number;

    constructor(id: number, title: string, averageAnswerTime: number, correctAnswerCount: number, incorrectAnswerCount: number, unansweredCount: number) {
        this.id = id;
        this.title = title;
        this.averageAnswerTime = averageAnswerTime;
        this.correctAnswerCount = correctAnswerCount;
        this.incorrectAnswerCount = incorrectAnswerCount;
    }

    getId(): number {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getAverageAnswerTime(): number {
        return this.averageAnswerTime;
    }

    getCorrectAnswerCount(): number {
        return this.correctAnswerCount;
    }

    getIncorrectAnswerCount(): number {
        return this.incorrectAnswerCount;
    }
}