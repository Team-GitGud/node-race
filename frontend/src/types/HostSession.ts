import { Session } from './Session';
import { Player } from './Player';
import { Question } from './Question';
import { QuestionAdapter, BackendQuestion } from './QuestionAdapter';
import { Ref, ref } from 'vue';

export class HostSession extends Session {
    hostId: string;
    players: Ref<Player[]>;

    constructor(ws: WebSocket, lobbyCode: string, hostId: string) {
        super(ws, lobbyCode);
        this.hostId = hostId;
        this.players = ref([]);

        // Set up event listeners for incoming messages
        this.addEventListener("GAME_STARTED_HOST", (data) => {
            this.handleGameStarted(data.questions);
        });
        
        this.addEventListener("SESSION_ENDED", (data) => {
            this.handleSessionEnded(data.reason);
        });

        this.addEventListener("PLAYER_JOINED", (data) => {
            const newPlayer = new Player(data.player.playerId, data.player.username);
            this.players.value.push(newPlayer);
        });
        
        this.addEventListener("PLAYER_LEFT", (data) => {
            this.players.value = this.players.value.filter(player => player.id !== data.playerId);
            console.log("Player left:", data.playerId);
        });

        this.addEventListener("ALL_PLAYERS", (data) => {
            if (data.players) {
                const playerObjects = data.players.map((serverPlayer: any) => 
                    new Player(serverPlayer.id, serverPlayer.name, parseInt(serverPlayer.score) || 0)
                );
                this.players.value = playerObjects;
                console.log("Players updated from server:", playerObjects);
            }
        });

        // Listen for server error messages
        this.addEventListener("SERVER_ERROR", (data) => {
            console.error("Server error received:", data.message);
        });
    }

    public handleGameStarted(questions: BackendQuestion[]) {
        if (questions !== undefined && questions.length > 0) {
            // If there's no players, for some reason there's no questions generated.
            const adaptedQuestions = QuestionAdapter.fromBackendQuestions(questions);
            console.log("Adapted questions:", adaptedQuestions);
        }
    }

    public handleSessionEnded(reason: string) {
        console.log("Session ended with reason:", reason);
    }

    /**
     * Get the players in the session.
     */
    public getPlayers(): void {
        this.ws.send(JSON.stringify({
            action: "GET_ALL_PLAYERS",
            hostId: this.hostId,
            data: {
                lobbyId: this.lobbyCode
            }
        }));
    }

    /**
     * Start the game for all players.
     */
    public startGame(): void {
        this.ws.send(JSON.stringify({
            action: "START_GAME",
            hostId: this.hostId,
            data: {
                lobbyId: this.lobbyCode,
            }
        }));
    }

    /**
     * Ends the game session for all players.
     */
    public endGame(): void {
        this.ws.send(JSON.stringify({
            action: "END_GAME",
            hostId: this.hostId,
            data: {
                lobbyId: this.lobbyCode,
            }
        }));
    }

    /**
     * Kick a player from the lobby.
     * @param playerId The ID of the player to kick
     */
    public kickPlayer(playerId: string): void {
        this.ws.send(JSON.stringify({
            action: "KICK_PLAYER",
            hostId: this.hostId,
            data: {
                lobbyId: this.lobbyCode,
                playerId: playerId
            }
        }));
        console.log("Kick player request sent for:", playerId);
    }
}