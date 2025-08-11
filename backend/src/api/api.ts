import express from 'express';
import cors from 'cors';
import { WebSocket, WebSocketServer, RawData } from 'ws';
import { IncomingMessage } from 'node:http';
import http from 'http';
import { LobbyManager } from '../data-access/lobbyManager';


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

            const path: String = req.url ?? "";
            console.log(path);
            this.handleInitialConnection(ws, path);

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

    static handleInitialConnection(ws: WebSocket, path: String) {
    }

    static handleMessages(message: any) {
        console.log("inside handle message" + message.name)
    }
}
