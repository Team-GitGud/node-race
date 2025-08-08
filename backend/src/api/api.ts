import express from 'express';
import cors from 'cors';
const WebSocket = require('ws');

const wss = new WebSocket.Server(8090);
export function api() {
    const app = express();
    const port = 3000;

    app.use(cors({
        credentials: true
    }));

    wss.on("connection", (ws: any) => {
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
