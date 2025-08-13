const ws = new WebSocket(`ws://localhost:3000/thing`);

ws.onopen = () => {
    console.log(`Connected to ws://localhost:3000/thing`);
    ws.send('{"name": "joe"}')
    ws.send('{"Joe": "')
};

ws.onmessage = (event) => {
    console.log("Message from server:", event.data);
};

ws.onerror = (error) => {
    console.error("WebSocket error:", error);
};

ws.onclose = () => {
    console.log("Connection closed");
};

const a = new WebSocket(`ws://localhost:3000/api/v1/lobby/create`);
const b = new WebSocket(`ws://localhost:3000/api/v1/lobby/join?name=joeJoin`);
