"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = api;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
//const WebSocket = require('ws');
const ws_1 = require("ws");
const WS_PORT = 8090;
const wss = new ws_1.WebSocketServer({ port: WS_PORT });
function api() {
    const app = (0, express_1.default)();
    const port = 3000;
    app.use((0, cors_1.default)({
        credentials: true
    }));
    wss.on("connection", (ws) => {
        ws.on("message", (data) => {
        });
    });
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });
    app.listen(port, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${port}`);
    });
}
