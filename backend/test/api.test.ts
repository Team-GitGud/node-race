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
                resolve(JSON.parse(data.toString()));
            });
        });
    }

    beforeEach(async () => {
        api.init();

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

    it("beforeEach works", () => {
        assert.isNotNull(lobby);
        assert.isNotNull(player);
        assert.isNotNull(lobbyCode);
        assert.isNotNull(playerId);
    });
});
