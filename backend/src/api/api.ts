import express from 'express';
import cors from 'cors';

export function api() {
    const app = express();
    const port = 3000;

    app.use(cors({
        credentials: true
    }));

    app.get('/helloworld/', (req, res) => {
        res.send('Hello, World from Express with TypeScript!');
        console.log("Request recieved");
    });

    app.get('/hi/', (req, res) => {
        res.send('hi');
        console.log("Request recieved");
    });

    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });

    app.listen(port, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${port}`);
    });
}
