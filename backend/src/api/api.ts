import express from 'express';

export function api() {
    const app = express();
    const port = 3000;

    app.get('/helloworld/', (req, res) => {
        res.send('Hello, World from Express with TypeScript!');
        console.log("Request recieved");
    });

    app.get('/hi/', (req, res) => {
        res.send('hi');
        console.log("Request recieved");
    });

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}
