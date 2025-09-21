import { ApiResponseFactory } from "../api/apiResponseFactory";
import { Player } from "./player"
import { WebSocket } from 'ws';
import { GameLogic } from "../session-logic/gameLogic";
import { Database } from "./db";
import { LobbyManager } from "./lobbyManager";
import { Timer } from "./timer";

/**
 * This class represents a lobby in NodeRace and its purpose is to:
 *  - Manage Players
 *  - keep track of the time
 *  - Mange GlobalLeaderboard once game has ended
 */
export class Lobby {
    lobbyID: string = '';
    players: Player[] = [];
    hostToken: string;
    timer: Timer = new Timer();
    database: Database = new Database();
    ws: WebSocket;
    gameLogic: GameLogic;
    lobbyManager: LobbyManager;
    gameStarted: boolean = false;

    /**
     * This WebSocket is communicating with the lobby host
     */
    constructor(ws: WebSocket, lobbyManager: LobbyManager) {
        this.ws = ws;
        this.lobbyID = Lobby.generateKey();
        this.hostToken = this.generateHostToken();
        this.gameLogic = new GameLogic();
        this.lobbyManager = lobbyManager;
    }

    /**
    * Creates a Player object and add to the list of playars
    */
    join(playerName: string, ws: WebSocket): void {
        if (this.players.some(p => p.getName() == playerName)) {
            ws.send("Students cannot have the same name");
        }
        let p: Player = new Player(playerName, ws, this);
        this.players.push(p);
        this.ws.send(ApiResponseFactory.playerJoinHostResponse(p.ID, playerName));
        ws.send(ApiResponseFactory.playerJoinPlayerResponse(p.ID, this.getAllPlayersJson()));
    }

    /**
    * Starts a game by sending the start signal to every player in the lobby
    */
    startGame(): void {
        if (this.gameStarted) return;
        this.gameStarted = true;
        this.gameLogic.generateQuestions();
        this.timer.start(this.timerEndGame.bind(this), this);
        this.ws.send(ApiResponseFactory.startGameHostResponse());
        this.players.forEach((p: Player) => p.startGame(this.gameLogic.getQuestionJSON()));
    }

    timerEndGame(): void {
        this.endGame();
    }

    /**
    * Ends a game by sending the end signal to every payer in the lobby
    */
    endGame(): void {
        console.log("game end started");
        this.ws.send(ApiResponseFactory.endGameHostResponse());
        this.ws.close()
        let db = new Database();
        this.players.forEach((p: Player): number => db.addData(p.getName(), p.getScore()));
        this.players.forEach((p: Player): void => p.endGame(this.generateSessionLeaderboardJson(), this.database.getLeaderboard(), this.timer.getTime() + '', this.database.getPos(p.score), this.getRank(p.ID)));
        this.players = [];
        this.lobbyManager.removeLobby(this.lobbyID);
        console.log("game end ended");
    }

    /**
     * Generates the session leaderboard from the current lobby/game
     * This is not saved and its different from the global leaderboard
     */
    generateSessionLeaderboardJson(): string {
        let rank: number = 1;
        return JSON.stringify(
            this.players
                .sort((a: Player, b: Player) => b.score - a.score)
                .map(p => ApiResponseFactory.sessionLeaderboardGenerator(rank++, p.name, p.score))
        );
    }

    /**
    * Calculates the score of a player.
    */
    calculateScore(playerID: string, answer: { [k: string]: number; }, questionNumber: number): boolean {
        let p: Player | undefined = this.players.find((pl) => pl.ID == playerID);
        if (p == undefined) { return false; }
        // Just does nothing if a question 
        if (p.questionHistory[questionNumber] != undefined) {
            return false;
        }
        let correct = this.gameLogic.questions[questionNumber].solution
        for (let key in correct) {
            if (correct[key] != answer[key]) {
                p.questionHistory[questionNumber] = false;
                p.calculateScore(this.timer, false);
                return true;
            }
        }
        p.questionHistory[questionNumber];
        p.calculateScore(this.timer, true);
        return true;
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
        const characters: String = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const charactersLength = characters.length;

        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * This is for the host to kick someone.
     * Removes a player from the game.
     * @param playerId The player to remove.
     */
    removePlayer(playerId: string): void {
        const removedPlayer: Player = this.players.filter(p => p.ID === playerId)[0];
        this.players = this.players.filter(p => p.ID !== playerId);

        removedPlayer.ws.send(ApiResponseFactory.kickPlayerResponse("PLAYER_KICKED", "Removed by host"));
        this.ws.send(ApiResponseFactory.playerLeftResponse("PLAYER_LEFT", removedPlayer.ID, this.getAllPlayersJson()));
    }

    /**
     * This is for the Player when a player leaves on their own.
     * Removes a player from a game.
     * @param playerId The player to remove.
     */
    playerLeave(playerId: string): void {
        const removedPlayer: Player = this.players.filter(p => p.ID === playerId)[0];
        this.players = this.players.filter(p => p.ID !== playerId);
        this.ws.send(ApiResponseFactory.playerLeftResponse("PLAYER_LEAVE", removedPlayer.ID, this.getAllPlayersJson()));
    }

    /**
     * Checks if the id is the host and if the id has permission to do certain api actions.
     */
    validateHost(id: string): boolean {
        return id === this.hostToken;
    }

    /**
     * Fetches all players in the lobby to the host.
     */
    sendAllPlayers(): void {
        this.ws.send(ApiResponseFactory.getAllPlayerResponse(this.getAllPlayersJson()));
    }

    /**
     * Rejoins a player or host for when they reload the browser.
     * This function closes the old websocket related to the entity and assign a new websocket to the entity.
     * @param playerId playerId, could also be the hostId.
     * @param playerWs the new websocket.
     */
    rejoinLobby(playerId: string, playerWs: WebSocket): void {
        if (playerId === this.hostToken) {
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

    /**
     * returns a single player, the return will be undefined if a player with the give id doesnt exist.
     */
    getPlayer(playerId: string): Player | undefined {
        return this.players.filter(p => p.ID === playerId)[0];
    }

    /**
     * returns the json format of all the players in the current lobby.
     */
    getAllPlayersJson(): string {
        return `[${this.players.map((p: Player) => p.toJsonString()).join(',')}]`;
    }

    getLeaderboard() {
        // Sort players first based on score
        this.players.sort((a, b) => a.getScore() - b.getScore());
        let playerStringArray: string[] = [];
        for (let index = 0; index < this.players.length; index++) {
            playerStringArray.push(`{"rank": "${index + 1}", "name": "${this.players[index].getName()}", "score": "${this.players[index].getScore()}"}`);
        }
        return JSON.stringify(playerStringArray);

    }

    getRank(playerId: string) {
        this.players.sort((a, b) => a.getScore() - b.getScore());
        let p = this.players.find((p) => p.ID == playerId)
        if (p != undefined) {
            return this.players.indexOf(p);
        }
        return -1;

    }
}
