export class ApiResponseFactory {
    static createLobbyResponse(lobbyCode: string, hostToken: string): String {
        return JSON.stringify(`
        {
            "lobbyCode": "${lobbyCode}",
            "hostToken": "${hostToken}"
        }
        `);
    }

    static playerJoinResponse(playerId: string): String {
        return JSON.stringify(`
        {
            "playerId": "${playerId}"
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

    static startGamePlayerResponse(questions: string): string {
        return JSON.stringify(`
        {
            "type": "GAME_STARTED",
            "questions": ${questions} 
        }
        `);
    }

    static startGameHostResponse(): string {
        return JSON.stringify(`
        {
            "type": "GAME_STARTED_HOST"
        }
        `);
    }

    static getAllPlayerResponse(playerArray: string): string {
        return JSON.stringify(`
        {
            "type": "ALL_PLAYERS",
            "players": ${playerArray}
        }
        `);
    }

    static playerRejoinResponse(name: string, score: string, questions: string | undefined): string {
        return JSON.stringify(`
        {
            "name": "${name}",
            "score": "${score}",
            "questions": "${questions}"
        }
        `);
    }

    static hostRejoinResponse(players: string): string {
        return JSON.stringify(`
        {
            "players": "${players}" }
        `);
    }
}
