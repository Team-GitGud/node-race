import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import APIManager from './APIManager';
import { HostSession } from './HostSession';
import { AlertService } from './AlertService';
import { QuestionData } from './QuestionData';
import { PlayerAnswers } from './PlayerAnswers';
import { GameTimer } from './GameTimer';

export function useHostSession() {
    const lobbyCode = ref('');
    const router = useRouter();
    const gameStarted = ref(false);
    const questions = ref<QuestionData[]>([]);
    const playersData = ref<PlayerAnswers[]>([]);   
    const showAnalytics = ref(false);
    const gameEnded = ref(false);
    const gameTimer = ref<GameTimer | null>(null);

    const saveData = () => {
        const saved = {
            players: playersData.value.map(player => ({
                id: player.getId(),
                nickname: player.getNickname(),
                score: player.getScore(),
                answers: player.getAnswers(),
            })),
            questions: questions.value.map(question => ({
                id: question.getId(),
                title: question.getTitle(),
                averageAnswerTime: question.getAverageAnswerTime(),
                correctAnswerCount: question.getCorrectAnswerCount(),
                incorrectAnswerCount: question.getIncorrectAnswerCount(),
                unansweredCount: question.getUnansweredCount()
            })),
            gameStarted: gameStarted.value,
            showAnalytics: showAnalytics.value,
            lobbyCode: lobbyCode.value,
            gameTimer: gameTimer.value ? gameTimer.value.toJSON() : null,
            gameEnded: gameEnded.value
        };
        localStorage.setItem('host-session-data', JSON.stringify(saved));
    };

    const loadData = () => {
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

        lobbyCode.value = data.lobbyCode || '';
        showAnalytics.value = data.showAnalytics || false;
        gameStarted.value = data.gameStarted || false;
        gameTimer.value = data.gameTimer ? GameTimer.fromJSON(data.gameTimer) : null;
        gameEnded.value = data.gameEnded || false;
    };

    onMounted(async () => {
        const apiManager = APIManager.getInstance();
        const session = await apiManager.getSession();

        if (!(session instanceof HostSession)) {
            AlertService.alert('No host session found. Please create a session first.');
            router.push('/');
            return;
        }

        // Load persisted data first
        loadData();
        
        lobbyCode.value = session.lobbyCode;

        session.addEventListener("ANALYTICS_UPDATED", (data) => {
            session.updateHostSessionData(data);
            saveData();
        });

        playersData.value = [];
        session.getPlayers();
        
        playersData.value = session.playerQuestions.value.map((player: any) => {
            return new PlayerAnswers(
                player.id || player.getId?.() || '', 
                player.nickname || player.getNickname?.() || '', 
                player.score || player.getScore?.() || 0, 
                player.answers || player.getAnswers?.() || []
            );
        });

        // Watch for question data updates
        watch(
            session.AllQuestionsData,
            (newQuestions) => {
                questions.value = [...newQuestions];
                saveData();
            },
            { deep: true }
        );

        // Watch for player data updates from session
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
                }).sort((a, b) => b.getScore() - a.getScore());

                playersData.value = updatedPlayers;
                saveData(); // Persist player updates
            },
            { deep: true }
        );

        session.addEventListener("GAME_STARTED_HOST", () => {
            gameStarted.value = true;
            showAnalytics.value = true;
            saveData();
            setupGameTimer();
        });

        session.addEventListener("GAME_END", () => {
            gameStarted.value = false;
            gameTimer.value = null;
            showAnalytics.value = true;
            gameEnded.value = true;
            saveData();
        });

        const setupGameTimer = () => {
            const start = new Date().getTime();
            const fiveMinutes = 1000 * 60 * 5;
            gameTimer.value = new GameTimer(start, start + fiveMinutes);
            gameTimer.value.start();
            showAnalytics.value = true;
            saveData();
        };
    });

    return { lobbyCode, playersData, questions, gameStarted, gameEnded, showAnalytics, gameTimer };
}