import { Player } from "./player.ts"

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
    hostToken: string;
    timer: any = null;
    ws: WebSocket;

    /**
     * This WebSocket is communicating with the lobby host
     */
    constructor(ws: WebSocket) {
        this.ws = ws;
        this.lobbyID = this.generateKey();
        this.hostToken = this.generateHostToken();
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

    /**
    * Starts a game by sending the start signal to every player in the lobby
    */
    startGame(): void {
        this.gameStarted = true;
        this.players.forEach((p: Player) => p.startGame());
    }

    /**
    * Ends a game by sending the end signal to every payer in the lobby
    */
    endGame(): void {
        this.gameStarted = false;
        this.players.forEach((p: Player) => p.endGame());
    }

    /**
    * Updates the score of a player
    * May be removed later and replaced with calculateScore
    */
    updateScore(playerName: string, score: number): void {
        let p: Player | undefined = this.players.find((pl) => pl.name == playerName);
        if (p == undefined) { return; }
        p.setScore(score);
    }

    /**
     * Generates the token for the host, used to authenticate host actions like remove player
     */
    generateHostToken(): string {
        return `h_sess_${this.generateKey()}`
    }

    /**
     * generates a random string of length 5
    */
    generateKey(): string {
        const length: number = 5;
        const characters: String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;

        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
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
