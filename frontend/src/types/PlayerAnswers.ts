import { Player } from './Player';

export class PlayerAnswers extends Player {
    private answers: Array<boolean | null>;
    constructor(id: string, nickname: string, score: number, answers: Array<boolean | null>) {
        
        score = Math.round(score);
        
        super(id, nickname, score);
        
        // Start with 5 nulls, then overlay any provided answers
        this.answers = [null, null, null, null, null];
        answers.forEach((answer, index) => {
            if (index < 5 && (answer === true || answer === false)) {
                this.answers[index] = answer;
            }
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