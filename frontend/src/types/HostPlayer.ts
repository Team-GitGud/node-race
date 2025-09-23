import { Player } from './Player';

export class HostPlayer extends Player {
    private answers: Array<boolean | null>;
    private rank: number;
    constructor(id: string, nickname: string, score: number, answers: Array<boolean | null>, rank: number) {
        super(id, nickname, score);
        this.answers = answers;
        this.rank = rank;
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

    getRank(): number {
        return this.rank;
    }

    setRank(rank: number) {
        this.rank = rank;
    }

    setAnswers(answers: Array<boolean | null>) {
        this.answers = answers;
    }
}