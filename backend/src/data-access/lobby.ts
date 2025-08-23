import { ApiResponseFactory } from "../api/apiResponseFactory";
import { Player } from "./player"
import { WebSocket } from 'ws';
import { GameLogic } from "../session-logic/gameLogic";
import { Database } from "./db";

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
    database: Database = new Database();
    ws: WebSocket;
    gameLogic: GameLogic;

    /**
     * This WebSocket is communicating with the lobby host
     */
    constructor(ws: WebSocket) {
        this.ws = ws;
        this.lobbyID = Lobby.generateKey();
        this.hostToken = this.generateHostToken();
        this.gameLogic = new GameLogic();
    }

    /**
    * Creates a Player object and add to the list of playars
    */
    join(playerName: string, ws: WebSocket): void {
        if (this.players.some(p => p.getName() == playerName)) {
            ws.send("Students cannot have the same name");
        }
        let p: Player = new Player(playerName, ws);
        this.players.push(p);
        ws.send(ApiResponseFactory.playerJoinResponse(p.ID, this.getAllPlayersJson()))
    }

    /**
    * Starts a game by sending the start signal to every player in the lobby
    */
    startGame(): void {
        this.gameStarted = true;
        this.gameLogic.generateQuestions();
        this.ws.send(ApiResponseFactory.startGameHostResponse());
        this.players.forEach((p: Player) => p.startGame(this.gameLogic.getQuestionJSON()));
    }

    /**
    * Ends a game by sending the end signal to every payer in the lobby
    */
    endGame(): void {
        this.gameStarted = false;
        let db = new Database();
        this.players.forEach((p: Player) => {
            p.endGame();
            db.addData(p.getName(), p.getScore());
        });
    }

    /**
    * Calculates the score of a player.
    */
    calculateScore(playerID: string, answer: { [k: string]: number; }, questionNumber: number ): void {
        let p: Player | undefined = this.players.find((pl) => pl.ID == playerID);
        if (p == undefined) { return; }
        let correct = this.gameLogic.questions[questionNumber].solution
        for (let key in correct){
            if (correct[key] != answer[key]){
                p.calculateScore(this.timer, false);
                return;
            }
        }
        p.calculateScore(this.timer, true);
    }

    /**
     * Generates the token for the host, used to authenticate host actions like remove player
     */
    generateHostToken(): string {
        return `h_sess_${Lobby.generateKey()}`
    }

    /**
     * generates a random string of length 5
    */
    static generateKey(): string {
        const length: number = 5;
        const characters: String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;

        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    removePlayer(playerID: string): void {
        const removedPlayer: Player = this.players.filter(p => p.ID === playerID)[0];
        this.players = this.players.filter(p => p.ID !== playerID);

        removedPlayer.ws.send(ApiResponseFactory.kickPlayerResponse("PLAYER_KICKED", "Removed by host"));
        this.ws.send(ApiResponseFactory.playerLeftResponse("PLAYER_LEFT", removedPlayer.ID, this.getAllPlayersJson()));
    }

    validateHost(id: string): boolean {
        return id === this.hostToken;
    }

    sendAllPlayers(): void {
        this.ws.send(ApiResponseFactory.getAllPlayerResponse(this.getAllPlayersJson()));
    }

    rejoinLobby(playerId: string, playerWs: WebSocket): void {
        if (playerId === this.lobbyID) {
            this.ws.close();
            this.ws = playerWs;
            this.ws.send(ApiResponseFactory.hostRejoinResponse(this.getAllPlayersJson()));
            return;
        }
        const player = this.getPlayer(playerId);
        if (player === undefined) {
            playerWs.send("Rejoin Failed, playerID does not exist");
            return;
        }

        player.rejoin(playerWs, this.gameLogic.getQuestionJSON());
    }

    getPlayer(playerId: string): Player | undefined {
        return this.players.filter(p => p.ID === playerId)[0];
    }

    getAllPlayersJson(): string {
        return JSON.stringify(this.players.map((p: Player) => p.toJsonString()));
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
