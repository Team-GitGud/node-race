import { Player } from './Player';

export class PlayerAnswers extends Player {
    private answers: Array<boolean | null>;
    constructor(id: string, nickname: string, score: number, answers: Array<boolean | null>) {

        score = Math.round(score);

        super(id, nickname, score);

        const normalizedAnswers = Array.isArray(answers) ? answers : [];
        const length = Math.max(5, normalizedAnswers.length);

        this.answers = Array.from({ length }, (_, index) => {
            const value = normalizedAnswers[index];

            if (value === true || value === false) {
                return value;
            }

            return null;
        });
    }

    getId(): string {
        return this.id;
    }

    getNickname(): string {
        return this.nickname;
    }

    getScore(): number {    
        return this.score;
    }
    
    getAnswers(): Array<boolean | null> {
        return this.answers;
    }
}