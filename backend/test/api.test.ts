import { describe, it, expect, beforeAll } from "vitest";

describe('API Endpoints', () => {
    let createdLobbyId: string;

    describe('Lobby Operations', () => {
        it('should create a new lobby', async () => {
            const res = await fetch('http://localhost:3000/api/v1/lobby/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'TestLobby' })
            });
            
            expect(res.status).toBe(201);
            const data = await res.json();
            expect(data).toHaveProperty('id');
            createdLobbyId = data.id;
        });
    });
});