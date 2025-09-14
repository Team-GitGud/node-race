export class ApiResponseFactory {
    static createLobbyResponse(lobbyCode: string, hostToken: string): String {
        return `
        {
            "type:": "LOBBY_CREATE",
            "lobbyCode": "${lobbyCode}",
            "hostToken": "${hostToken}"
        }
        `;
    }

    static playerJoinPlayerResponse(playerId: string, playerArray: string): String {
        return `
        {
            "type:": "PLAYER_JOIN_PLAYER_RESPONSE",
            "playerId": "${playerId}",
            "players": ${playerArray}
        }
        `;
    }

    static playerJoinHostResponse(playerId: string, userName: string): String {
        return `
        {
            "type": "PLAYER_JOINED",
            "player": {
                "playerId": "${playerId}",
                "username": "${userName}"
            }
        }
        `;
    }

    static kickPlayerResponse(type: string, reason: string): String {
        return `
        {
            "type": "${type}",
            "reason": "${reason}"
        }
        `;
    }

    static playerLeftResponse(type: string, playerId: string, playerArray: string): String {
        return `
        {
            "type": "${type}",
            "playerId": "${playerId}",
            "players": ${playerArray}
        }
        `;
    }

    static startGamePlayerResponse(questions: string): string {
        return `
        {
            "type": "GAME_STARTED",
            "questions": ${questions} 
        }
        `;
    }

    static startGameHostResponse(): string {
        return `
        {
            "type": "GAME_STARTED_HOST"
        }
        `;
    }

    static endGamePlayerResponse(time: string, numCorrect: string, answer: string, sessLeaderboard: string, globalLeaderoard: string, rank: number, lobbyRank: number): string {
        return `
        {
            "type": "GAME_END",
            "time": "${time}",
            "numCorrect": "${numCorrect}",
            "answer": ${answer},
            "sessLeaderboard": ${sessLeaderboard},
            "globalLeaderoard": ${globalLeaderoard},
            "rank": ${rank},
            "lobbyRank": ${lobbyRank}
        }
        `;
    }

    static sessionLeaderboardGenerator(rank: string | number, name: string, score: string | number): string {
        return `
            { 
                "type:": "SESSON_LEADERBOARD",
                "rank": "${rank}", 
                "name": "${name}", 
                "score": "${score}" 
            }
        `;
    }

    static endGameHostResponse(): string {
        return `
        {
            "type": "GAME_END"
        }
        `;
    }

    static getAllPlayerResponse(playerArray: string): string {
        return `
        {
            "type": "ALL_PLAYERS",
            "players": ${playerArray}
        }
        `;
    }

    static playerRejoinResponse(name: string, score: string, questions: string | undefined): string {
        return `
        {
            "type:": "PLAYER_REJOIN",
            "name": "${name}",
            "score": "${score}",
            "questions": ${questions}
        }
        `;
    }

    static hostRejoinResponse(players: string): string {
        return `
        {
            "type:": "HOST_REJOIN",
            "players": ${players}
        }
        `;
    }

    static getRankResponse(rank: number, lobbyRank: number): string {
        return `
        {
            "type:": "RANK",
            "rank": ${rank},
            "lobbyRank": ${lobbyRank}
        }
        `;
    }

    static getLeaderboardResponse(leaderboard: string, lobbyLeaderboard: string): string {
        return `
        {
            "type": "LEADERBOARD",
            "leaderboard": ${leaderboard},
            "lobbyLeaderboard": ${lobbyLeaderboard} 
        }
        `;
    }
}
