import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import APIManager from './APIManager';
import { HostSession } from './HostSession';
import { AlertService } from './AlertService';
import { QuestionData } from './QuestionData';
import { PlayerAnswers } from './PlayerAnswers';
import { GameTimer } from './GameTimer';

/**
 * Vue composition function that manages the host session state and lifecycle.
 * Handles session initialization, data persistence, real-time updates, and game state management.
 * Provides reactive state for the host view component.
 */
export function useHostSession() {
    // Reactive state for the lobby code
    const lobbyCode = ref('');
    // Vue router instance for navigation
    const router = useRouter();
    // Tracks whether the game has started
    const gameStarted = ref(false);
    // Array of question data with statistics
    const questions = ref<QuestionData[]>([]);
    // Array of player data with scores and answers
    const playersData = ref<PlayerAnswers[]>([]);
    // Controls whether analytics view is shown
    const showAnalytics = ref(false);
    // Tracks whether the game has ended
    const gameEnded = ref(false);
    // Game timer instance for managing time-based gameplay
    const gameTimer = ref<GameTimer | null>(null);

    /**
     * Saves the current session state to localStorage for persistence.
     * This ensures that the host can recover their session state on page refresh.
     */
    const saveData = () => {
        // Serialize current state into a plain object structure
        const saved = {
            // Convert PlayerAnswers objects to plain objects for storage
            players: playersData.value.map(player => ({
                id: player.getId(),
                nickname: player.getNickname(),
                score: player.getScore(),
                answers: player.getAnswers(),
            })),
            // Convert QuestionData objects to plain objects for storage
            questions: questions.value.map(question => ({
                id: question.getId(),
                title: question.getTitle(),
                averageAnswerTime: question.getAverageAnswerTime(),
                correctAnswerCount: question.getCorrectAnswerCount(),
                incorrectAnswerCount: question.getIncorrectAnswerCount(),
                unansweredCount: question.getUnansweredCount()
            })),
            // Include all primitive reactive state
            gameStarted: gameStarted.value,
            showAnalytics: showAnalytics.value,
            lobbyCode: lobbyCode.value,
            // Serialize timer data if it exists
            gameTimer: gameTimer.value ? gameTimer.value.toJSON() : null,
            gameEnded: gameEnded.value
        };
        // Store the serialized data in localStorage
        localStorage.setItem('host-session-data', JSON.stringify(saved));
    };

    /**
     * Loads previously saved session state from localStorage.
     * Reconstructs object instances from serialized data to restore the session state.
     */
    const loadData = () => {
        // Retrieve saved data from localStorage
        const saved = localStorage.getItem('host-session-data');
        if (!saved) return;
        const data = JSON.parse(saved);

        // Reconstruct PlayerAnswers objects from saved data
        if (data.players) {
            playersData.value = data.players.map((player: any) =>
                new PlayerAnswers(player.id, player.nickname, player.score, player.answers || [])
            );
        }

        // Reconstruct QuestionData objects from saved data
        if (data.questions) {
            questions.value = data.questions.map((question: any) =>
                new QuestionData(
                    question.id,
                    question.title,
                    question.averageAnswerTime,
                    question.correctAnswerCount,
                    question.incorrectAnswerCount,
                    question.unansweredCount
                )
            );
        }

        // Restore primitive state values with fallbacks
        lobbyCode.value = data.lobbyCode || '';
        showAnalytics.value = data.showAnalytics || false;
        gameStarted.value = data.gameStarted || false;
        // Reconstruct GameTimer instance from serialized data
        gameTimer.value = data.gameTimer ? GameTimer.fromJSON(data.gameTimer) : null;
        gameEnded.value = data.gameEnded || false;
    };

    /**
     * Vue lifecycle hook that initializes the host session when the component mounts.
     * Sets up event listeners, watchers, and restores any persisted session state.
     */
    onMounted(async () => {
        // Get the current session from the API manager
        const apiManager = APIManager.getInstance();
        const session = await apiManager.getSession();

        // Validate that we have a valid host session
        if (!(session instanceof HostSession)) {
            AlertService.alert('No host session found. Please create a session first.');
            router.push('/');
            return;
        }

        // Load persisted data first to restore previous state
        loadData();

        // Set the lobby code from the active session
        lobbyCode.value = session.lobbyCode;

        // Listen for analytics updates from the server and persist them
        session.addEventListener("ANALYTICS_UPDATED", (data) => {
            session.updateHostSessionData(data);
            saveData();
        });

        // Initialize player data and request current player list
        playersData.value = [];
        session.getPlayers();

        // Convert session player data to PlayerAnswers objects for local state
        playersData.value = session.playerQuestions.value.map((player: any) => {
            return new PlayerAnswers(
                player.id || player.getId?.() || '',
                player.nickname || player.getNickname?.() || '',
                player.score || player.getScore?.() || 0,
                player.answers || player.getAnswers?.() || []
            );
        });

        // Watch for question data updates from the session and sync local state
        watch(
            session.AllQuestionsData,
            (newQuestions) => {
                questions.value = [...newQuestions];
                saveData();
            },
            { deep: true }
        );

        // Watch for player data updates from session and maintain sorted leaderboard
        watch(
            session.playerQuestions,
            (newPlayerData) => {
                // Create new PlayerAnswers objects from backend data
                const updatedPlayers = newPlayerData.map((player: any) => {
                    return new PlayerAnswers(
                        player.id || player.getId?.() || '',
                        player.nickname || player.getNickname?.() || '',
                        player.score || player.getScore?.() || 0,
                        player.answers || player.getAnswers?.() || [],
                    );
                }).sort((a, b) => b.getScore() - a.getScore()); // Sort by score descending

                playersData.value = updatedPlayers;
                saveData(); // Persist player updates
            },
            { deep: true }
        );

        // Handle game start event - transition to active gameplay state
        session.addEventListener("GAME_STARTED_HOST", () => {
            gameStarted.value = true;
            showAnalytics.value = true;
            saveData();
            setupGameTimer();
        });

        // Handle game end event - transition to post-game state
        session.addEventListener("GAME_END", () => {
            gameStarted.value = false;
            gameTimer.value = null; // Clear the timer
            showAnalytics.value = true; // Keep analytics visible for final results
            gameEnded.value = true;
            saveData();
        });

        /**
         * Initializes and starts the game timer for the session.
         * Sets up a 5-minute timer that tracks the game's duration.
         */
        const setupGameTimer = () => {
            const start = new Date().getTime();
            const fiveMinutes = 1000 * 60 * 5; // 5 minutes in milliseconds
            gameTimer.value = new GameTimer(start, start + fiveMinutes);
            gameTimer.value.start();
            showAnalytics.value = true;
            saveData();
        };
    });

    // Return reactive state for use in the host view component
    return { lobbyCode, playersData, questions, gameStarted, gameEnded, showAnalytics, gameTimer };
}