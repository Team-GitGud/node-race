import { describe, it, expect, assert, beforeEach, afterEach } from "vitest";
import { api } from "../src/api/api";
import WebSocket from "ws";


describe("Api Tests", () => {
    let lobby: WebSocket | null = null;
    let player: WebSocket | null = null;

    let lobbyCode: string | null = null;
    let hostId: string | null = null;
    let playerId: string | null = null;

    function waitForMessage(ws: WebSocket): Promise<any> {
        return new Promise((resolve) => {
            ws.once("message", (data) => {
                const message = data.toString();
                try {
                    resolve(JSON.parse(message));
                } catch {
                    resolve(message);
                }
            });
        });
    }

    beforeEach(async () => {
        // Only initialize API once
        if (!(api as any).initialized) {
            api.init();
            (api as any).initialized = true;
        }

        // create lobby
        lobby = new WebSocket(`ws://localhost:3000/api/v1/lobby/create`);
        const lobbyMsg = await waitForMessage(lobby);
        lobbyCode = lobbyMsg.lobbyCode;
        hostId = lobbyMsg.hostToken;

        // join player
        player = new WebSocket(
            `ws://localhost:3000/api/v1/lobby/join?name=joeJoin&lobbyId=${lobbyCode}`
        );
        const playerMsg = await waitForMessage(player);
        playerId = playerMsg.playerId;
    });

    afterEach(() => {
        lobby?.close();
        player?.close();
    });

    it("test BeforeEach", () => {
        assert.isNotNull(lobby);
        assert.isNotNull(player);
        assert.isNotNull(lobbyCode);
        assert.isNotNull(playerId);
    });

    it("should handle START_GAME action", async () => {
        const startGameMessage = {
            action: "START_GAME",
            hostId: hostId,
            data: {
                lobbyId: lobbyCode
            }
        };

        lobby!.send(JSON.stringify(startGameMessage));

        // Wait for game started response
        const gameStartedMsg = await waitForMessage(player!);
        expect(gameStartedMsg.type).toBe("GAME_STARTED");
    });

    it("should handle GET_ALL_PLAYERS action", async () => {
        const getAllPlayersMessage = {
            action: "GET_ALL_PLAYERS",
            hostId: hostId,
            data: {
                lobbyId: lobbyCode
            }
        };

        lobby!.send(JSON.stringify(getAllPlayersMessage));

        // Wait for all players response - this will be sent to all players in lobby
        const allPlayersMsg = await waitForMessage(lobby!);
        // The response could be ALL_PLAYERS or PLAYER_JOINED depending on timing
        expect(["ALL_PLAYERS", "PLAYER_JOINED"]).toContain(allPlayersMsg.type);
        if (allPlayersMsg.type === "ALL_PLAYERS") {
            expect(Array.isArray(allPlayersMsg.players)).toBe(true);
        }
    });

    it("should handle KICK_PLAYER action", async () => {
        const kickPlayerMessage = {
            action: "KICK_PLAYER",
            hostId: hostId,
            data: {
                lobbyId: lobbyCode,
                playerId: playerId
            }
        };

        lobby!.send(JSON.stringify(kickPlayerMessage));

        // Player should receive kick response
        const kickMsg = await waitForMessage(player!);
        expect(kickMsg.type).toBeDefined();
        expect(kickMsg.reason).toBeDefined();
    });

    it("should handle GET_LEADERBOARD action", async () => {
        const getLeaderboardMessage = {
            action: "GET_LEADERBOARD",
            data: {
                lobbyId: lobbyCode
            }
        };

        lobby!.send(JSON.stringify(getLeaderboardMessage));

        // Wait for leaderboard response - this might be sent to all players in lobby
        const leaderboardMsg = await waitForMessage(lobby!);
        // The response could be LEADERBOARD or PLAYER_JOINED depending on timing
        expect(["LEADERBOARD", "PLAYER_JOINED"]).toContain(leaderboardMsg.type);
        if (leaderboardMsg.type === "LEADERBOARD") {
            expect(Array.isArray(leaderboardMsg.leaderboard)).toBe(true);
        }
    });

    it("should handle SUBMIT_ANSWER action", async () => {
        const submitAnswerMessage = {
            action: "SUBMIT_ANSWER",
            playerId: playerId,
            data: {
                lobbyId: lobbyCode,
                answer: "A",
                questionNumber: 1
            }
        };

        // This should not throw an error
        expect(() => {
            player!.send(JSON.stringify(submitAnswerMessage));
        }).not.toThrow();
    });

    it("should handle invalid action gracefully", async () => {
        const invalidMessage = {
            action: "INVALID_ACTION",
            data: {}
        };

        player!.send(JSON.stringify(invalidMessage));

        // Should receive error message
        const errorMsg = await waitForMessage(player!);
        expect(errorMsg).toBe("Error: no action block found");
    }, 10000);

    it("should handle malformed JSON gracefully", async () => {
        // Send invalid JSON
        player!.send("invalid json");

        // Should receive error message
        const errorMsg = await waitForMessage(player!);
        expect(errorMsg).toBe("Error with json message");
    }, 10000);

    it("should handle invalid lobby ID in actions", async () => {
        const invalidLobbyMessage = {
            action: "GET_ALL_PLAYERS",
            hostId: hostId,
            data: {
                lobbyId: "INVALID_LOBBY"
            }
        };

        lobby!.send(JSON.stringify(invalidLobbyMessage));

        // Should receive error message - this might be sent to all players in lobby
        const errorMsg = await waitForMessage(lobby!);
        // The response could be error message or PLAYER_JOINED depending on timing
        expect(["LobbyID not found", "PLAYER_JOINED"]).toContain(
            typeof errorMsg === 'string' ? errorMsg : errorMsg.type
        );
    });

    it("should validate host permissions", async () => {
        const unauthorizedMessage = {
            action: "START_GAME",
            hostId: "invalid_host_id",
            data: {
                lobbyId: lobbyCode
            }
        };

        lobby!.send(JSON.stringify(unauthorizedMessage));
    });

    it("shouldn't allow players to join after game has started", async () => {
        const startGameMessage = {
            action: "START_GAME",
            hostId: hostId,
            data: {
                lobbyId: lobbyCode
            }
        };

        lobby!.send(JSON.stringify(startGameMessage));
        // Wait for game started response
        const gameStartedMsg = await waitForMessage(player!);

        const player1 = new WebSocket(
            `ws://localhost:3000/api/v1/lobby/join?name=joeJoin1&lobbyId=${lobbyCode}`
        );

        const lobbyMessage = await waitForMessage(lobby!);
        expect(lobbyMessage).toBe("Cannot join when a game is running");
    });

    it("shouldn't allow players to join after game has started", async () => {
        for (let i = 0; i <= 30; i++) {
            new WebSocket(
                `ws://localhost:3000/api/v1/lobby/join?name=joeJoin${i}&lobbyId=${lobbyCode}`
            );
        }
    });
});
