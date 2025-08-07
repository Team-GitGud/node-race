
export class Lobby {
    id: string;
    player: string[] = [];
    host: string;
    time: any = null;

    constructor(id: string, host: string) {
        this.id = id;
        this.host = host;
    }

    join(): void {

    }

    generateKey(): string {
        return "a";
    }

    calculateScore(): void {

    }

    updateScore(): void {

    }

    getLeaderboard(): string[] {
        return [];
    }

    updateGlobalLeaderboard(getLeaderboard: string): void {

    }

    checkGameEnd(): boolean {
        return false;
    }

    startGame(): void {

    }

    getTime(): number {
        return 1;
    }
}
