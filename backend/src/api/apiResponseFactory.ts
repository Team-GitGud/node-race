export class ApiResponseFactory {
    static createLobbyResponse(lobbyCode: string, hostToken: string): String {
        return JSON.stringify(`
        {
            "lobbyCode": "${lobbyCode}",
            "hostToken": "${hostToken}"
        }
        `);
    }

    static playerJoinResponse(playerId: string, playerArray: string): String {
        return JSON.stringify(`
        {
            "playerId": "${playerId}",
            "players": ${playerArray}
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

    static playerLeftResponse(type: string, playerId: string, playerArray: string): String {
        return JSON.stringify(`
        {
            "type": "${type}",
            "playerId": "${playerId}",
            "players": ${playerArray}
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

    static endGamePlayerResponse(time: string, numCorrect: string, answer: string, sessLeaderboard: string, globalLeaderoard: string): string {
        return JSON.stringify(`
        {
            "type": "GAME_END",
            "time": "${time}",
            "numCorrect": "${numCorrect}",
            "answer": ${answer},
            "sessLeaderboard": ${sessLeaderboard},
            "globalLeaderoard": ${globalLeaderoard}
        }
        `);
    }

    static sessionLeaderboardGenerator(rank: string | number, name: string, score: string | number): string {
        return JSON.stringify(`
            { 
                "rank": "${rank}", 
                "name": "${name}", 
                "score": "${score}" 
            }
        `);
    }

    static endGameHostResponse(): string {
        return JSON.stringify(`
        {
            "type": "GAME_END"
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
            "questions": ${questions}
        }
        `);
    }

    static hostRejoinResponse(players: string): string {
        return JSON.stringify(`
        {
            "players": ${players}
        }
        `);
    }

    static getLeaderboardResponse(leaderboard: string): string {
        return JSON.stringify(`
        {
            "type": "LEADERBOARD",
            "leaderboard": ${leaderboard} 
        }
        `);
    }
}
