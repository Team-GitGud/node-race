import { Lobby } from "./lobby";
import { ApiResponseFactory } from "../api/apiResponseFactory";
import { WebSocket } from 'ws';

export class LobbyManager {
    lobbies: Map<string, Lobby> = new Map<string, Lobby>;

    /**
    * creates a lobby
    */
    createLobby(ws: WebSocket): void {
        const lobby: Lobby = new Lobby(ws);
        this.lobbies.set(lobby.lobbyID, lobby);
        ws.send(ApiResponseFactory.createLobbyResponse(lobby.lobbyID, lobby.hostToken).toString());
    }

    /**
     * gets the lobby with the accociated lobbyID
     */
    getLobby(lobbyID: string): Lobby {
        return this.lobbies.get(lobbyID);
    }
}
