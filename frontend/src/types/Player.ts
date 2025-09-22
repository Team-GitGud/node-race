export class Player {
    id: string;
    nickname: string;
    score: number;
    globalRank: number;
    lobbyRank: number;

    constructor(id: string, nickname: string, score = 0) {
        this.id = id;
        this.nickname = nickname;
        this.score = score;
        this.globalRank = -1;
        this.lobbyRank = -1;
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

    setScore(score: number) {
        this.score = score;
    }

    setGlobalRank(rank: number) {
        this.globalRank = rank;
    }

    getGlobalRank(): number {
        return this.globalRank;
    }

    setLobbyRank(rank: number) {
        this.lobbyRank = rank;
    }

    getLobbyRank(): number {
        return this.lobbyRank;
    }
}