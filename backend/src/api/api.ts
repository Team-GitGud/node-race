import express from 'express';
import cors from 'cors';
import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'node:http';
import http from 'http';


export function api() {
    const app = express();
    const EXPRESS_PORT = 3000;

    app.use(cors({
        credentials: true
    }));

    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });

    app.get('/', (req, res) => {
        res.send("Hi");
    });

    const server = http.createServer(app)
    const wss = new WebSocketServer({ server });
    wss.on("listening", () => { })
    wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {

        const path: string = req.url ?? "";
        console.log(path);

        ws.on("message", (data: any) => {

        })
    })

    server.listen(EXPRESS_PORT);
}
