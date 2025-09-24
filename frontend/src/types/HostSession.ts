import { Session } from './Session';
import { Ref, ref } from 'vue';
import { QuestionData } from './QuestionData';
import { PlayerAnswers } from './PlayerAnswers';

export class HostSession extends Session {
    hostId: string;
    AllQuestionsData: Ref<QuestionData[]>;
    playerQuestions: Ref<PlayerAnswers[]>;

    constructor(ws: WebSocket, lobbyCode: string, hostId: string) {
        super(ws, lobbyCode);
        this.hostId = hostId;
        this.AllQuestionsData = ref([]);
        this.playerQuestions = ref([]);
        
        this.addEventListener("GAME_END", (data) => {
            this.handleSessionEnded(data.reason);
        });

        this.addEventListener("PLAYER_JOINED", (data) => {
            const newPlayer = new PlayerAnswers(data.player.playerId, data.player.username, 0, [], 0);
            this.playerQuestions.value.push(newPlayer);
        });
        
        this.addEventListener("PLAYER_LEFT", (data) => {
            this.playerQuestions.value = this.playerQuestions.value.filter(player => player.id !== data.playerId);
        });

        this.addEventListener("ALL_PLAYERS", (data) => {
            if (data.players) {
                const playerObjects = data.players.map((serverPlayer: any) => 
                    new PlayerAnswers(serverPlayer.id, serverPlayer.name, parseInt(serverPlayer.score) || 0, [], 0)
                );
                this.playerQuestions.value = playerObjects;
            }
        });

        this.addEventListener("PLAYER_LEAVE", (data) => {
            this.playerQuestions.value = this.playerQuestions.value.filter(player => player.id !== data.playerId);
        });

        // Listen for server error messages
        this.addEventListener("SERVER_ERROR", (data) => {
            console.error("Server error received:", data.message);
        });

        this.addEventListener("ANALYTICS_UPDATED", (data) => {

            console.log("Analytics updated:", data);

            // Process question data
            if (data.questionData) {
                const questionsData = data.questionData.map((question: any) =>
                    new QuestionData(question.id, question.title, question.averageAanswerTime, question.correctAnswerCount, question.incorrectAnswerCount, question.unansweredCount)
                );
                this.AllQuestionsData.value = questionsData;
            }

            // Process player data
            if (data.playerData) {
                const playersData = data.playerData.map((player: any) =>
                    new PlayerAnswers(player.playerId, player.name, player.score, player.answers || [], player.rank)
                );
                this.playerQuestions.value = playersData;
            }
        });
    }

    public handleSessionEnded(reason: string) {
        console.log("Game ended with reason:", reason);
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
    }

    public getHostId(): string {
        return this.hostId;
    }
    // In some places we're calling it hostToken, so we'll keep it for now.
    public getHostToken(): string {
        return this.hostId;
    }
}