export class QuestionData {
    private id: number;
    private title: string;
    private averageAnswerTime: string;
    private correctAnswerCount: number;
    private incorrectAnswerCount: number;
    private unansweredCount: number;

    constructor(id: number, title: string, averageAnswerTime: number | string, correctAnswerCount: number, incorrectAnswerCount: number, unansweredCount: number) {
        this.id = id;
        this.title = title;
        this.averageAnswerTime = typeof averageAnswerTime === 'string'
            ? averageAnswerTime
            : this.formatTime(averageAnswerTime);
        this.correctAnswerCount = correctAnswerCount;
        this.incorrectAnswerCount = incorrectAnswerCount;
        this.unansweredCount = unansweredCount;
    }

    private formatTime(seconds: number): string {
        return isNaN(seconds)
            ? '00:00'
            : `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.round(seconds) % 60).padStart(2, '0')}`;
    }

    getId(): number {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getAverageAnswerTime(): string {
        return this.averageAnswerTime;
    }

    getCorrectAnswerCount(): number {
        return this.correctAnswerCount;
    }

    getIncorrectAnswerCount(): number {
        return this.incorrectAnswerCount;
    }

    getUnansweredCount(): number {
        return this.unansweredCount;
    }
}