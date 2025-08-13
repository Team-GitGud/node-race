export class ApiResponseFactory {
    static createLobbyResponse(lobbyCode: string, hostToken: string): String {
        return `
        {
            "lobbyCode: "${lobbyCode}"
            "hostToken: "${hostToken}"
        }
        `;
    }

    static playerJoinResponse(playerId: string): String {
        return `
        {
        "playerId": "${playerId}",
        }
        `;
    }
}
