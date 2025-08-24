const a = new WebSocket(`ws://localhost:3000/api/v1/lobby/create`);

a.onmessage = (event) => {
    console.log("Message from server:", event.data);
    console.log("Message from server:", JSON.parse(JSON.parse(event.data)));
};

const b = new WebSocket(`ws://localhost:3000/api/v1/lobby/join?name=joeJoin`);
b.onmessage = (event) => {
    console.log("Message from server:", event.data);
};
