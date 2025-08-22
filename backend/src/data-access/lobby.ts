import { Player } from "./player"
import { WebSocket } from 'ws';

/**
 * This class represents a lobby in NodeRace and its purpose is to:
 *  - Manage Players
 *  - keep track of the time
 *  - Mange GlobalLeaderboard once game has ended
 */
export class Lobby {
    gameStarted: boolean = false;
    lobbyID: string = '';
    players: Player[] = [];
    timer: any = null;
    ws: WebSocket;

    /**
     * This WebSocket is communicating with the lobby host
     */
    constructor(id: string, ws: WebSocket) {
        this.lobbyID = id;
        this.ws = ws;
    }

    /**
    * Creates a Player object and add to the list of playars
    * TODO return something if a player with this name exists 
    */
    join(playerName: string, ip: string): void {
        //TODO chage ip to WebSocket
        if (this.players.some(p => p.getName() == playerName)) return;
        let p: Player = new Player(playerName, ip);
        this.players.push(p);
    }

    startGame(): void {
        this.players.forEach((p: Player) => p.startGame());
    }

    endGame(): void {
        this.players.forEach((p: Player) => p.endGame());
    }

    updateScore(playerName: string, score: number): void {
        let p: Player | undefined = this.players.find((pl) => pl.name == playerName);
        if (p == undefined) { return; }
        p.setScore(score);
    }

    calculateScore(): void {
        //TODO: implement when we figure out how score is supposed to be calculated
    }

    getLeaderboard() {
        //TODO: implement with leaderboard
    }

    updateGlobalLeaderboard(): void {
        //TODO: implement with leaderboard
    }

    checkGameEnd(): boolean {
        //TODO: implement after timer
        return false;
    }

    getTime(): number {
        //TODO: implement after timer
        return 1;
    }
}
