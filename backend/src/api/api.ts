import express from 'express';
import cors from 'cors';
import { WebSocket, WebSocketServer, RawData } from 'ws';
import { IncomingMessage } from 'node:http';
import http from 'http';
import { LobbyManager } from '../data-access/lobbyManager';
import { url } from 'node:inspector';
import { Lobby } from '../data-access/lobby';


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
                    console.log(jsonMessage.name);
                    this.handleMessages(jsonMessage);
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
        const path: string = fullURL.pathname;

        switch (path) {
            case (ApiPaths.CREATE_LOBBY):
                this.lobbies.createLobby(ws);
                break;

            case (ApiPaths.JOIN_LOBBY):
                // Parse url urlParameters
                const urlParameters = Object.fromEntries(fullURL.searchParams.entries());
                const playerName: string = urlParameters.name;
                const lobbyID: string = urlParameters.lobbyID;

                // Check if lobbyID is correct before joining game
                const lobby: Lobby | undefined = this.lobbies.getLobby(lobbyID, ws);
                if (lobby === undefined) {
                    ws.send("LobbyID not found");
                    console.log(`Player: ${playerName} attempted to Join ${lobbyID} but ID doesn't exist`);
                } else {
                    lobby.join(playerName, ws);
                    console.log(`Player: ${playerName} Joined Lobby: ${lobbyID}`);
                }
                break;

            default:
                ws.send("Error: path not found");
        }
    }

    static handleMessages(message: any) {
        console.log("inside handle message" + message.name)
    }
}

class ApiPaths {
    static CREATE_LOBBY = '/api/v1/lobby/create';
    static JOIN_LOBBY = '/api/v1/lobby/join';
}
