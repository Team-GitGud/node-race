import express from 'express';
import cors from 'cors';
import { WebSocket, WebSocketServer, RawData } from 'ws';
import { IncomingMessage } from 'node:http';
import http from 'http';
import { LobbyManager } from '../data-access/lobbyManager';
import { url } from 'node:inspector';
import { Lobby } from '../data-access/lobby';
import { ApiResponseFactory } from './apiResponseFactory';


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
    * Handles the initial connection between the frontend and backend
    * There are 2 main cases, lobby creation and playerJoining a lobby
    */
    static handleInitialConnection(ws: WebSocket, data: IncomingMessage) {
        const fullURL: URL = new URL(data.url ?? "", "http://localhost");
        const urlParameters = Object.fromEntries(fullURL.searchParams.entries());
        const path: string = fullURL.pathname;

        console.log(data.url);

        switch (path) {
            case (ApiPaths.CREATE_LOBBY):
                this.lobbies.createLobby(ws);
                break;


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

            default:
                ws.send("Error: path not found");
        }
    }

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

            default:
                ws.send("Error: no action block found");
        }
    }

    static getLeaderboard(message: any, ws: WebSocket): void {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyID not found");
            return;
        }

        ws.send(ApiResponseFactory.getLeaderboardResponse(lobby.database.getLeaderboard()));

    }


    static submitAnswer(message: any, ws: WebSocket): void {
        const lobbyId = message.data.lobbyId;
        const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyId);
        if (lobby === undefined) {
            ws.send("LobbyID not found");
            return;
        }

        lobby.calculateScore(message.playerId, message.data.answer, message.data.questionNumber);

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
    }
}

class ApiPaths {
    static CREATE_LOBBY = '/api/v1/lobby/create';
    static JOIN_LOBBY = '/api/v1/lobby/join';
    static REJOIN_LOBBY = '/api/v1/lobby/rejoin';
}
