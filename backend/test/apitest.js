const ws = new WebSocket(`ws://localhost:3000/thing`);

ws.onopen = () => {
    console.log(`Connected to ws://localhost:3000/thing`);
    ws.send("Joe")
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

