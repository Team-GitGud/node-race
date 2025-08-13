export class ApiResponseFactory {
    static createLobbyResponse(lobbyCode: string, hostToken: string): String {
        return JSON.stringify({
            lobbyCode,
            hostToken
        });
    }

    static playerJoinResponse(playerId: string): String {
        return `
        {
        "playerId": "${playerId}",
        }
        `;
    }
}
