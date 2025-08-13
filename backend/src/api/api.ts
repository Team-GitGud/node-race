import express from 'express';
import cors from 'cors';
import { WebSocket, WebSocketServer, RawData } from 'ws';
import { IncomingMessage } from 'node:http';
import http from 'http';
import { LobbyManager } from '../data-access/lobbyManager';
import { url } from 'node:inspector';


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

        const server = http.createServer(this.app)
        const wss = new WebSocketServer({ server });
        wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {

            this.handleInitialConnection(ws, req);

            ws.on("message", (data: RawData) => {
                try {
                    const jsonMessage = JSON.parse(data.toString()) as { name?: string };
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
                console.log("New lobby created");
                break;

            case (ApiPaths.JOIN_LOBBY):
                const urlParameters = Object.fromEntries(fullURL.searchParams.entries());
                const playerName: string = urlParameters.name;
                const lobbyID: string = urlParameters.lobbyID;
                this.lobbies.getLobby(lobbyID).join(playerName, ws);
                console.log(`Player: ${playerName} Joined Lobby: ${lobbyID}`);
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
