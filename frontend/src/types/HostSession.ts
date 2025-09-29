import { Session } from './Session';
import { Ref, ref } from 'vue';
import { QuestionData } from './QuestionData';
import { PlayerAnswers } from './PlayerAnswers';

/**
 * HostSession class manages the game session from the host's perspective.
 * Extends the base Session class with host-specific functionality including
 * player management, game control, and analytics tracking.
 */
export class HostSession extends Session {
    // Unique identifier for the host
    hostId: string;
    // Reactive array containing data for all questions in the session
    AllQuestionsData: Ref<QuestionData[]>;
    // Reactive array containing answers and scores for all players
    playerQuestions: Ref<PlayerAnswers[]>;

    /**
     * Creates a new HostSession instance.
     * @param ws - WebSocket connection for real-time communication
     * @param lobbyCode - Unique code identifying the game lobby
     * @param hostId - Unique identifier for the session host
     */
    constructor(ws: WebSocket, lobbyCode: string, hostId: string) {
        super(ws, lobbyCode);
        this.hostId = hostId;
        // Initialize reactive arrays to track questions and players
        this.AllQuestionsData = ref([]);
        this.playerQuestions = ref([]);

        // Handle new player joining the session
        this.addEventListener("PLAYER_JOINED", (data) => {
            // Create a new PlayerAnswers object for the joined player with initial score of 0
            const newPlayer = new PlayerAnswers(data.player.playerId, data.player.username, 0, []);
            this.playerQuestions.value.push(newPlayer);
        });

        // Handle player leaving the session
        this.addEventListener("PLAYER_LEFT", (data) => {
            // Remove the player from the playerQuestions array
            this.playerQuestions.value = this.playerQuestions.value.filter(player => player.id !== data.playerId);
        });

        // Handle receiving all players data (typically on initial load or refresh)
        this.addEventListener("ALL_PLAYERS", (data) => {
            if (data.players) {
                // Convert server player data to PlayerAnswers objects
                const playerObjects = data.players.map((serverPlayer: any) =>
                    new PlayerAnswers(serverPlayer.id, serverPlayer.name, parseInt(serverPlayer.score) || 0, [])
                );
                this.playerQuestions.value = playerObjects;
            }
        });

        // Listen for server error messages
        this.addEventListener("SERVER_ERROR", (data) => {
            console.error("Server error received:", data.message);
        });

        // Handle analytics updates from the server (question stats, player performance)
        this.addEventListener("ANALYTICS_UPDATED", (data) => {
            this.updateHostSessionData(data);
        });
    }

    /**
     * Update the host session data with analytics information from the server.
     * This includes question statistics and player performance data.
     * @param data - Analytics data containing question and player statistics
     */
    public updateHostSessionData(data: any): void {
        // Process question data - convert server question analytics to QuestionData objects
        if (data.questionData) {
            const questionsData = data.questionData.map((question: any) =>
                new QuestionData(question.id, question.title, question.averageAnswerTime, question.correctAnswerCount, question.incorrectAnswerCount, question.unansweredCount)
            );
            this.AllQuestionsData.value = questionsData;
        }

        // Process player data - update player scores and answer history
        if (data.playerData) {
            const playersData = data.playerData.map((player: any) =>
                new PlayerAnswers(player.playerId, player.name, player.score, player.answers || [])
            );
            this.playerQuestions.value = playersData;
        }
    }

    /**
     * Request the current list of players from the server.
     * This will trigger an "ALL_PLAYERS" event with the updated player list.
     */
    public getPlayers(): void {
        // Send WebSocket message to server requesting all players in the lobby
        this.ws.send(JSON.stringify({
            action: "GET_ALL_PLAYERS",
            hostId: this.hostId,
            data: {
                lobbyId: this.lobbyCode
            }
        }));
    }

    /**
     * Start the game session for all players in the lobby.
     * This transitions the lobby from waiting state to active gameplay.
     */
    public startGame(): void {
        // Send WebSocket message to server to begin the game
        this.ws.send(JSON.stringify({
            action: "START_GAME",
            hostId: this.hostId,
            data: {
                lobbyId: this.lobbyCode,
            }
        }));
    }

    /**
     * End the current game session for all players.
     * This will finalize scores and potentially show final results.
     */
    public endGame(): void {
        // Send WebSocket message to server to terminate the game
        this.ws.send(JSON.stringify({
            action: "END_GAME",
            hostId: this.hostId,
            data: {
                lobbyId: this.lobbyCode,
            }
        }));
    }

    /**
     * Remove a specific player from the lobby.
     * The player will be disconnected and can no longer participate.
     * @param playerId - The unique identifier of the player to remove
     */
    public kickPlayer(playerId: string): void {
        // Send WebSocket message to server to remove the specified player
        this.ws.send(JSON.stringify({
            action: "KICK_PLAYER",
            hostId: this.hostId,
            data: {
                lobbyId: this.lobbyCode,
                playerId: playerId
            }
        }));
    }
}