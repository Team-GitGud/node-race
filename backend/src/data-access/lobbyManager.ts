import { Lobby } from "./lobby";
import { ApiResponseFactory } from "../api/apiResponseFactory";
import { WebSocket } from 'ws';

export class LobbyManager {
    lobbies: Map<string, Lobby> = new Map<string, Lobby>();

    /**
    * creates a lobby
    */
    createLobby(ws: WebSocket): void {
        const lobby: Lobby = new Lobby(ws, this);
        this.lobbies.set(lobby.lobbyID, lobby);
        ws.send(ApiResponseFactory.createLobbyResponse(lobby.lobbyID, lobby.hostToken).toString());
        console.log("New lobby created");
    }

    /**
     * gets the lobby with the accociated lobbyID
     */
    getLobby(lobbyID: string): Lobby | undefined {
        return this.lobbies.get(lobbyID);
    }

    removeLobby(lobbyID: string): void {
        this.lobbies.delete(lobbyID);
    }
}
