export class ApiResponseFactory {
    static createLobbyResponse(lobbyCode: string, hostToken: string): String {
        return JSON.stringify(`
        {
            "lobbyCode: "${lobbyCode}"
            "hostToken: "${hostToken}"
        }
        `);
    }

    static playerJoinResponse(playerId: string): String {
        return JSON.stringify(`
        {
            "playerId": "${playerId}",
        }
        `);
    }

    static kickPlayerResponse(type: string, reason: string): String {
        return JSON.stringify(`
        {
            "type": "${type}",
            "reason": "${reason}"
        }
        `);
    }

    static playerLeftResponse(type: string, playerId: string): String {
        return JSON.stringify(`
        {
            "type": "${type}",
            "playerId": "${playerId}"
        }
        `);
    }

    static startGamePlayerResponse(): string {

    }

    static startGameHostResponse(): string {
        return JSON.stringify(`
        {
            "type": "PLAYER_JOINED"
        }
        `);
    }
}
