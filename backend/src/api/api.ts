import express from 'express';
import cors from 'cors';
import { WebSocket, WebSocketServer, RawData } from 'ws';
import { IncomingMessage } from 'node:http';
import http from 'http';
import { LobbyManager } from '../data-access/lobbyManager';
import { Lobby, playerData, questionData } from '../data-access/lobby';
import { ApiResponseFactory } from './apiResponseFactory';
import { GameLogic } from '../session-logic/gameLogic';
import { Player } from '../data-access/player';
import { Database } from "../data-access/db";
import { SourceTextModule } from 'node:vm';


export class api {
    static app = express();
    static PORT: number = 3000;
    static lobbies: LobbyManager = new LobbyManager();

    /**
    * Initilizes the api by setting up a listner at the specified port and WebSocket.
    */
    static init() {
        this.app.use(cors({
            credentials: true
        }));

        // health check
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });

        // Create Server
        const server = http.createServer(this.app)
        const wss = new WebSocketServer({ server });

        // Create Websocker
        wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
            // Deal with connection
            this.handleInitialConnection(ws, req);

            // Deal with requests
            ws.on("message", (data: RawData) => {
                try {
                    const jsonMessage = JSON.parse(data.toString());
                    this.handleMessages(jsonMessage, ws);
                } catch (error) {
                    ws.send("Error with json message");
                    console.log("Error with json message");
                    return;
                }
            });
        })

        server.listen(this.PORT);
    }

    /**
    * Handles the initial connection between the frontend and backend parameters 
    * are passed in the url because  the initial connection does not accept JSON.
    *
    * @param ws the websocket object associated with the initial connection.
    * @param data the data from the frontend including url.
    */
    static handleInitialConnection(ws: WebSocket, data: IncomingMessage) {
        const fullURL: URL = new URL(data.url ?? "", "http://localhost");
        const urlParameters = Object.fromEntries(fullURL.searchParams.entries());
        const path: string = fullURL.pathname;

        console.log(data.url);

        switch (path) {
            // Creates a Lobby 
            case (ApiPaths.CREATE_LOBBY):
                this.lobbies.createLobby(ws);
                break;


            // Lets a player Join a lobby
            case (ApiPaths.JOIN_LOBBY):
                console.log("lobby join");
                // Parse url urlParameters
                const playerName: string = urlParameters.name;
                const lobbyId: string = urlParameters.lobbyId;

                // Check if lobbyID is correct before joining game
                const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
                if (lobby === undefined) {
                    ws.send("LobbyID not found");
                    console.log(`Player: ${playerName} attempted to Join ${lobbyId} but ID doesn't exist`);
                } else {
                    lobby.join(playerName, ws);
                    console.log(`Player: ${playerName} Joined Lobby: ${lobbyId}`);
                }
                break;

            // Lets player or host rejoin lobby if they refresh the broswer tab
            case (ApiPaths.REJOIN_LOBBY):
                // Parse url urlParameters
                const playerId: string = urlParameters.id;
                const lobbyJoinId: string = urlParameters.lobbyId;

                // Check if lobbyID is correct before joining game
                const lobbyJoin: Lobby | undefined = this.lobbies.getLobby(lobbyJoinId);
                if (lobbyJoin === undefined) {
                    ws.send("Rejoin LobbyID not found");
                } else {
                    lobbyJoin.rejoinLobby(playerId, ws);
                }
                break;

            // Single player option that returns a single question
            case (ApiPaths.PRACTICE):
                console.log("practice");
                ws.send(ApiResponseFactory.practiceQuestionResponse(JSON.stringify(new GameLogic().generateQuestion(false))))
                break;

            // Returns the leaderboard when theres no game
            case (ApiPaths.LEADERBOARD):
                // Send leaderboard here
                console.log("Sending only global leaderboard");
                ws.send(ApiResponseFactory.getLeaderboardResponse(new Database().getLeaderboard()))
                break;

            default:
                ws.send("Error: path not found");
        }
    }

    /**
    * This functions handles requests from the frontend while a game is running.
    * The messages in this case is a json object and each json rquest must contain an action parameter.
    *
    * @param message json message containing the request content.
    * @param ws the websocket associated with the request.
    */
    static handleMessages(message: any, ws: WebSocket) {
        const action: string = message.action;

        switch (action) {
            case ("UPDATE_SETTINGS"):
                ws.send("Update not implemented yet");
                break;

            case ("KICK_PLAYER"):
                this.kickPlayer(message, ws);
                break;

            case ("START_GAME"):
                this.startGame(message, ws);
                break;

            case ("GET_ALL_PLAYERS"):
                this.getAllPlayers(message, ws);
                break;

            case ("GET_LEADERBOARD"):
                this.getLeaderboard(message, ws);
                break;

            case ("SUBMIT_ANSWER"):
                this.submitAnswer(message, ws);
                break;

            case ("GET_RANK"):
                this.getRank(message, ws);
                break;

            case ("END_GAME"):
                this.endGame(message, ws);
                break;

            case ("PLAYER_LEAVE"):
                this.playerLeave(message, ws);
                break;
            case ("GET_SCORE"):
                this.getScore(message, ws);
                break;

            default:
                ws.send("Error: no action block found");
        }
    }

    static analyticsUpdate(lobby: Lobby){
        console.log("THing");
        console.log(ApiResponseFactory.getAnalyticsUpdate(lobby.getLobbyAnalytics(), lobby.getPlayerAnalytics()));
        lobby.ws.send(ApiResponseFactory.getAnalyticsUpdate(lobby.getLobbyAnalytics(), lobby.getPlayerAnalytics()));
    }

    static getScore(message: any, ws: WebSocket): void {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyID not found");
            return;
        }
        const playerId = message.playerId;
        const player = lobby.getPlayer(playerId);
        if (player === undefined) {
            ws.send("PlayerID not found");
            return;
        }
        ws.send(ApiResponseFactory.getScoreResponse(player.score, lobby.getRank(player.ID)));
    }

    static playerLeave(message: any, ws: WebSocket): void {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyId not found");
            return;
        }

        const playerId: string = message.data.playerId;
        lobby.playerLeave(playerId)
        if (!lobby.players.some(player => player.ID === playerId)) {
            console.log("Kicked player:", playerId);
        }
        this.analyticsUpdate(lobby);
    }

    static endGame(message: any, ws: WebSocket) {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyID not found");
            return;
        }

        if (lobby.validateHost(message.hostId)) {
            lobby.endGame();
        } else {
            ws.send("Invalid host token");
            return;
        }
        this.analyticsUpdate(lobby);

    }

    static getRank(message: any, ws: WebSocket) {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyID not found");
            return;
        }

        let player = lobby.getPlayer(message.playerId);
        if (player != undefined) {
            ws.send(ApiResponseFactory.getRankResponse(lobby.database.getPos(player.score), lobby.getRank(player.ID)));
        } else {
            ws.send(ApiResponseFactory.getRankResponse(-1, -1));
        }

    }

    static getLeaderboard(message: any, ws: WebSocket): void {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyID not found");
            return;
        }

        ws.send(ApiResponseFactory.getLeaderboardResponse(lobby.database.getLeaderboard(), lobby.getLeaderboard()));

    }


    static submitAnswer(message: any, ws: WebSocket): void {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyID not found");
            return;
        }

        if (!lobby.calculateScore(message.playerId, message.data.answer, message.data.questionNumber)) {
            ws.send("Error processing answer either player does not exist or question already submitted");
        }
        this.analyticsUpdate(lobby);

    }

    static getAllPlayers(message: any, ws: WebSocket): void {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyID not found");
            return;
        }

        const hostId = message.hostId;
        if (!lobby.validateHost(hostId)) {
            return;
        }

        lobby.sendAllPlayers();
    }

    static startGame(message: any, ws: WebSocket) {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyID not found");
            return;
        }

        const hostId = message.hostId;
        if (!lobby.validateHost(hostId)) {
            return;
        }

        lobby.startGame();
        this.analyticsUpdate(lobby);
    }

    static kickPlayer(message: any, ws: WebSocket): void {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyId not found");
            return;
        }

        const hostId = message.hostId;
        if (!lobby.validateHost(hostId)) {
            return;
        }

        const playerId: string = message.data.playerId;
        lobby.removePlayer(playerId)
        if (!lobby.players.some(player => player.ID === playerId)) {
            console.log("Kicked player:", playerId);
        }
        this.analyticsUpdate(lobby);
    }
}

/**
* This is a static class that contains the all of the URL endpoints that does not need a websocket connection.
*/
class ApiPaths {
    static CREATE_LOBBY = '/api/v1/lobby/create';
    static JOIN_LOBBY = '/api/v1/lobby/join';
    static REJOIN_LOBBY = '/api/v1/lobby/rejoin';
    static PRACTICE = '/api/v1/practice';
    static LEADERBOARD = '/api/v1/leaderboard';
}
