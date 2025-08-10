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

    constructor() {

    }

    static init() {
        this.app.use(cors({
            credentials: true
        }));

        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });

        this.app.get('/', (req, res) => {
            res.send("Hi");
        });

        const server = http.createServer(this.app)
        const wss = new WebSocketServer({ server });
        wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {

            const path: String = req.url ?? "";
            console.log(path);
            this.handleRequests(path)

            ws.on("message", (data: RawData) => {
                let jsonMessage: JSON = JSON.parse(data.toString());
                console.log(jsonMessage);
                this.handleMessages(jsonMessage);
            })
        })

        server.listen(this.PORT);
    }

    static handleRequests(path: String) {
    }

    static handleMessages(message: JSON) {

    }
}
