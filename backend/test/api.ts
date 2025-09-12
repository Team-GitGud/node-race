import { WebSocket } from "ws";

/**HOW TO RUN
 * be in test folder
 * npx tsx ./api.ts
 */

let createdLobbyId: string;
let hostId: string;

let aMessages: Array<string> = [];
let bMessages: Array<string> = [];

let b: WebSocket;

function startGameTest() {
    console.log("Thing being ran");
    a.send(`{"action": "START_GAME","hostId": "${hostId}", "data": {"lobbyId": "${createdLobbyId}"}}`);

}

let tests: Array<() => void> = [startGameTest];

const a = new WebSocket(`ws://localhost:3000/api/v1/lobby/create`);
a.onmessage = async (event) => {
    aMessages.push(event.data.toString());
    if (aMessages.length < 2) {
        let data = JSON.parse(JSON.parse(event.data.toString()));
        console.log("Message from server:", data);
        createdLobbyId = data.lobbyCode;
        hostId = data.hostToken;
        console.log("got a host id: " + hostId);
        console.log("got a lobby code: " + createdLobbyId);
        console.log("Lobby code: " + createdLobbyId);
        b = new WebSocket(`ws://localhost:3000/api/v1/lobby/join?name=joeJoin&lobbyId=` + createdLobbyId);
        b.onmessage = (event) => {
            bMessages.push(event.data.toString());
            console.log("Message from server:", event.data);
            if (bMessages.length < 2) {
                tests.forEach((t) => { t() });
            }
        };
    }
};
