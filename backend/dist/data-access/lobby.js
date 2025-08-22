"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
const player_1 = require("./player");
/**
 * This class represents a lobby in NodeRace and its purpose is to:
 *  - Manage Players
 *  - keep track of the time
 *  - Mange GlobalLeaderboard once game has ended
 */
class Lobby {
    /**
     * This WebSocket is communicating with the lobby host
     */
    constructor(id, ws) {
        this.gameStarted = false;
        this.lobbyID = '';
        this.players = [];
        this.timer = null;
        this.lobbyID = id;
        this.ws = ws;
    }
    /**
    * Creates a Player object and add to the list of playars
    * TODO return something if a player with this name exists
    */
    join(playerName, ip) {
        //TODO chage ip to WebSocket
        if (this.players.some(p => p.getName() == playerName))
            return;
        let p = new player_1.Player(playerName, ip);
        this.players.push(p);
    }
    startGame() {
        this.players.forEach((p) => p.startGame());
    }
    endGame() {
        this.players.forEach((p) => p.endGame());
    }
    updateScore(playerName, score) {
        let p = this.players.find((pl) => pl.name == playerName);
        if (p == undefined) {
            return;
        }
        p.setScore(score);
    }
    calculateScore() {
        //TODO: implement when we figure out how score is supposed to be calculated
    }
    getLeaderboard() {
        //TODO: implement with leaderboard
    }
    updateGlobalLeaderboard() {
        //TODO: implement with leaderboard
    }
    checkGameEnd() {
        //TODO: implement after timer
        return false;
    }
    getTime() {
        //TODO: implement after timer
        return 1;
    }
}
exports.Lobby = Lobby;
