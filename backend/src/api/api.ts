import express from 'express';
import cors from 'cors';
//const WebSocket = require('ws');
import { WebSocket, WebSocketServer } from 'ws';

const WS_PORT: number = 8090;
const wss = new WebSocketServer({ port: WS_PORT });
export function api() {
    const app = express();
    const port = 3000;

    app.use(cors({
        credentials: true
    }));

    wss.on("connection", (ws: WebSocket) => {
        ws.on("message", (data: any) => {

        })
    })

    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });

    app.listen(port, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${port}`);
    });
}
