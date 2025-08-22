export class Player {
    id: string;
    nickname: string;
    score: number;

    constructor(id: string, nickname: string, score = 0) {
        this.id = id;
        this.nickname = nickname;
        this.score = score;
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
}