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
     * Gets the lobby with the accociated lobbyID.
     * @param lobbyId the lobbyId
     */
    getLobby(lobbyId: string): Lobby | undefined {
        return this.lobbies.get(lobbyId);
    }

    /**
     * Removes a lobby. This is essentially ending a game.
     * @param lobbyId the lobbyId
     */
    removeLobby(lobbyId: string): void {
        this.lobbies.delete(lobbyId);
    }
}
