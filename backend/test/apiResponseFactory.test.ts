import { describe, it, expect } from "vitest";
import { ApiResponseFactory } from "../src/api/apiResponseFactory";

describe("ApiResponseFactory Tests", () => {
    describe("createLobbyResponse", () => {
        it("should create a valid lobby creation response", () => {
            const lobbyCode = "ABC123";
            const hostToken = "host-token-123";
            
            const response = ApiResponseFactory.createLobbyResponse(lobbyCode, hostToken);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("LOBBY_CREATE");
            expect(parsed.lobbyCode).toBe(lobbyCode);
            expect(parsed.hostToken).toBe(hostToken);
        });

        it("should handle special characters in lobby code and host token", () => {
            const lobbyCode = "ABC-123_XYZ";
            const hostToken = "host-token_with.special@chars";
            
            const response = ApiResponseFactory.createLobbyResponse(lobbyCode, hostToken);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.lobbyCode).toBe(lobbyCode);
            expect(parsed.hostToken).toBe(hostToken);
        });
    });

    describe("playerJoinPlayerResponse", () => {
        it("should create a valid player join response for players", () => {
            const playerId = "player-123";
            const playerArray = '["player1", "player2", "player3"]';
            
            const response = ApiResponseFactory.playerJoinPlayerResponse(playerId, playerArray);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("PLAYER_JOIN_PLAYER_RESPONSE");
            expect(parsed.playerId).toBe(playerId);
            expect(parsed.players).toEqual(JSON.parse(playerArray));
        });

        it("should handle empty player array", () => {
            const playerId = "player-123";
            const playerArray = "[]";
            
            const response = ApiResponseFactory.playerJoinPlayerResponse(playerId, playerArray);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.players).toEqual(JSON.parse(playerArray));
        });
    });

    describe("playerJoinHostResponse", () => {
        it("should create a valid player join response for host", () => {
            const playerId = "player-123";
            const userName = "testUser";
            
            const response = ApiResponseFactory.playerJoinHostResponse(playerId, userName);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("PLAYER_JOINED");
            expect(parsed.player.playerId).toBe(playerId);
            expect(parsed.player.username).toBe(userName);
        });

        it("should handle special characters in username", () => {
            const playerId = "player-123";
            const userName = "test_user@domain.com";
            
            const response = ApiResponseFactory.playerJoinHostResponse(playerId, userName);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.player.username).toBe(userName);
        });
    });

    describe("kickPlayerResponse", () => {
        it("should create a valid kick player response", () => {
            const type = "PLAYER_KICKED";
            const reason = "Inappropriate behavior";
            
            const response = ApiResponseFactory.kickPlayerResponse(type, reason);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe(type);
            expect(parsed.reason).toBe(reason);
        });

        it("should handle different kick types and reasons", () => {
            const type = "ADMIN_KICK";
            const reason = "Game disruption";
            
            const response = ApiResponseFactory.kickPlayerResponse(type, reason);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe(type);
            expect(parsed.reason).toBe(reason);
        });
    });

    describe("playerLeftResponse", () => {
        it("should create a valid player left response", () => {
            const type = "PLAYER_LEFT";
            const playerId = "player-123";
            const playerArray = '["player1", "player2"]';
            
            const response = ApiResponseFactory.playerLeftResponse(type, playerId, playerArray);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe(type);
            expect(parsed.playerId).toBe(playerId);
            expect(parsed.players).toEqual(JSON.parse(playerArray));
        });

        it("should handle different leave types", () => {
            const type = "PLAYER_DISCONNECTED";
            const playerId = "player-456";
            const playerArray = '["player1"]';
            
            const response = ApiResponseFactory.playerLeftResponse(type, playerId, playerArray);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe(type);
            expect(parsed.playerId).toBe(playerId);
        });
    });

    describe("startGamePlayerResponse", () => {
        it("should create a valid game start response for players", () => {
            const questions = '[{"id": 1, "question": "What is 2+2?", "options": ["3", "4", "5", "6"]}]';
            
            const response = ApiResponseFactory.startGamePlayerResponse(questions);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("GAME_STARTED");
            expect(parsed.questions).toEqual(JSON.parse(questions));
        });

        it("should handle empty questions array", () => {
            const questions = "[]";
            
            const response = ApiResponseFactory.startGamePlayerResponse(questions);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.questions).toEqual(JSON.parse(questions));
        });
    });

    describe("startGameHostResponse", () => {
        it("should create a valid game start response for host", () => {
            const response = ApiResponseFactory.startGameHostResponse();
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("GAME_STARTED_HOST");
        });
    });

    describe("endGamePlayerResponse", () => {
        it("should create a valid game end response for players", () => {
            const time = "120";
            const numCorrect = "8";
            const answer = '{"question1": "A", "question2": "B"}';
            const sessLeaderboard = '[{"rank": 1, "name": "Player1", "score": 100}]';
            const globalLeaderboard = '[{"rank": 1, "name": "Player1", "score": 1000}]';
            
            const response = ApiResponseFactory.endGamePlayerResponse(
                time, numCorrect, answer, sessLeaderboard, globalLeaderboard
            );
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("GAME_END");
            expect(parsed.time).toBe(time);
            expect(parsed.numCorrect).toBe(numCorrect);
            expect(parsed.answer).toEqual(JSON.parse(answer));
            expect(parsed.sessLeaderboard).toEqual(JSON.parse(sessLeaderboard));
            expect(parsed.globalLeaderoard).toEqual(JSON.parse(globalLeaderboard));
        });

        it("should handle zero values", () => {
            const time = "0";
            const numCorrect = "0";
            const answer = "{}";
            const sessLeaderboard = "[]";
            const globalLeaderboard = "[]";
            
            const response = ApiResponseFactory.endGamePlayerResponse(
                time, numCorrect, answer, sessLeaderboard, globalLeaderboard
            );
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.time).toBe(time);
            expect(parsed.numCorrect).toBe(numCorrect);
        });
    });

    describe("sessionLeaderboardGenerator", () => {
        it("should create a valid session leaderboard entry with string values", () => {
            const rank = "1";
            const name = "Player1";
            const score = "100";
            
            const response = ApiResponseFactory.sessionLeaderboardGenerator(rank, name, score);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("SESSION_LEADERBOARD");
            expect(parsed.rank).toBe(rank);
            expect(parsed.name).toBe(name);
            expect(parsed.score).toBe(score);
        });

        it("should create a valid session leaderboard entry with number values", () => {
            const rank = 1;
            const name = "Player1";
            const score = 100;
            
            const response = ApiResponseFactory.sessionLeaderboardGenerator(rank, name, score);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.rank).toBe("1");
            expect(parsed.score).toBe("100");
        });

        it("should handle mixed string and number values", () => {
            const rank = 1;
            const name = "Player1";
            const score = "100";
            
            const response = ApiResponseFactory.sessionLeaderboardGenerator(rank, name, score);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.rank).toBe("1");
            expect(parsed.score).toBe(score);
        });
    });

    describe("endGameHostResponse", () => {
        it("should create a valid game end response for host", () => {
            const response = ApiResponseFactory.endGameHostResponse();
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("GAME_END");
        });
    });

    describe("getAllPlayerResponse", () => {
        it("should create a valid get all players response", () => {
            const playerArray = '[{"id": "player1", "name": "Player1"}, {"id": "player2", "name": "Player2"}]';
            
            const response = ApiResponseFactory.getAllPlayerResponse(playerArray);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("ALL_PLAYERS");
            expect(parsed.players).toEqual(JSON.parse(playerArray));
        });

        it("should handle empty player array", () => {
            const playerArray = "[]";
            
            const response = ApiResponseFactory.getAllPlayerResponse(playerArray);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.players).toEqual(JSON.parse(playerArray));
        });
    });

    describe("playerRejoinResponse", () => {
        it("should create a valid player rejoin response with questions", () => {
            const name = "Player1";
            const score = "100";
            const questions = '[{"id": 1, "question": "What is 2+2?"}]';
            
            const response = ApiResponseFactory.playerRejoinResponse(name, score, questions);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("PLAYER_REJOIN");
            expect(parsed.name).toBe(name);
            expect(parsed.score).toBe(score);
            expect(parsed.questions).toEqual(JSON.parse(questions));
        });

        it("should create a valid player rejoin response without questions", () => {
            const name = "Player1";
            const score = "100";
            const questions = undefined;
            
            const response = ApiResponseFactory.playerRejoinResponse(name, score, questions);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("PLAYER_REJOIN");
            expect(parsed.name).toBe(name);
            expect(parsed.score).toBe(score);
            expect(parsed.questions).toBe(null);
        });
    });

    describe("hostRejoinResponse", () => {
        it("should create a valid host rejoin response", () => {
            const players = '[{"id": "player1", "name": "Player1"}]';
            
            const response = ApiResponseFactory.hostRejoinResponse(players);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("HOST_REJOIN");
            expect(parsed.players).toEqual(JSON.parse(players));
        });

        it("should handle empty players array", () => {
            const players = "[]";
            
            const response = ApiResponseFactory.hostRejoinResponse(players);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.players).toEqual(JSON.parse(players));
        });
    });

    describe("getLeaderboardResponse", () => {
        it("should create a valid leaderboard response", () => {
            const leaderboard = '[{"rank": 1, "name": "Player1", "score": 1000}]';
            
            const response = ApiResponseFactory.getLeaderboardResponse(leaderboard);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.type).toBe("LEADERBOARD");
            expect(parsed.leaderboard).toEqual(JSON.parse(leaderboard));
        });

        it("should handle empty leaderboard", () => {
            const leaderboard = "[]";
            
            const response = ApiResponseFactory.getLeaderboardResponse(leaderboard);
            const parsed = JSON.parse(response.trim());
            
            expect(parsed.leaderboard).toEqual(JSON.parse(leaderboard));
        });
    });

    describe("JSON Validity", () => {
        it("should ensure all responses are valid JSON", () => {
            const methods = [
                () => ApiResponseFactory.createLobbyResponse("ABC123", "token123"),
                () => ApiResponseFactory.playerJoinPlayerResponse("player1", "[]"),
                () => ApiResponseFactory.playerJoinHostResponse("player1", "user1"),
                () => ApiResponseFactory.kickPlayerResponse("KICK", "reason"),
                () => ApiResponseFactory.playerLeftResponse("LEFT", "player1", "[]"),
                () => ApiResponseFactory.startGamePlayerResponse("[]"),
                () => ApiResponseFactory.startGameHostResponse(),
                () => ApiResponseFactory.endGamePlayerResponse("0", "0", "{}", "[]", "[]"),
                () => ApiResponseFactory.sessionLeaderboardGenerator(1, "player1", 100),
                () => ApiResponseFactory.endGameHostResponse(),
                () => ApiResponseFactory.getAllPlayerResponse("[]"),
                () => ApiResponseFactory.playerRejoinResponse("player1", "100", "[]"),
                () => ApiResponseFactory.hostRejoinResponse("[]"),
                () => ApiResponseFactory.getLeaderboardResponse("[]")
            ];

            methods.forEach((method, index) => {
                expect(() => {
                    const response = method();
                    JSON.parse(response.trim());
                }, `Method ${index} should produce valid JSON`).not.toThrow();
            });
        });
    });
});
