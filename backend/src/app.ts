import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World from Express with TypeScript!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
