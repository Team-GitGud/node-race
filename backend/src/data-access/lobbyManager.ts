import { Lobby } from "./lobby";
import { ApiResponseFactory } from "../api/apiResponseFactory";

export class LobbyManager {
    lobbies: Map<string, Lobby> = new Map<string, Lobby>;

    createLobby(ws: WebSocket) {
        const lobby: Lobby = new Lobby(ws);
        this.lobbies.set(lobby.lobbyID, lobby);
        ws.send(""); //TODO: send data
    }
}
