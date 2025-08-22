import { describe, it, expect } from "vitest";

describe('API Endpoints', () => {
    it('GET /api/v1/lobby/list should return lobby list', async () => {
        const res = await fetch('http://localhost:3000/api/v1/lobby/list');
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(Array.isArray(body)).toBe(true);
    });

    it('POST /api/v1/lobby/create should create a lobby', async () => {
        const res = await fetch('http://localhost:3000/api/v1/lobby/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'TestLobby' })
        });
        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body).toHaveProperty('id');
        expect(body.name).toBe('TestLobby');
    });

    it('POST /api/v1/lobby/join should join a lobby', async () => {
        // Replace 1 with a valid lobbyId if needed
        const res = await fetch('http://localhost:3000/api/v1/lobby/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'joeJoin', lobbyId: 1 })
        });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toHaveProperty('success', true);
    });

    // Add more endpoint tests as needed
});
