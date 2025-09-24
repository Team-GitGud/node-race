import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import APIManager from './APIManager';
import { HostSession } from './HostSession';
import { AlertService } from './AlertService';
import { QuestionData } from './QuestionData';
import { PlayerAnswers } from './PlayerAnswers';

export function useHostSession() {
    const lobbyCode = ref('');
    const router = useRouter();
    const gameStarted = ref(false);
    const questions = ref<QuestionData[]>([]);
    const playersData = ref<PlayerAnswers[]>([]);   

    // Persist game started state with timestamp
    // const saveGameStartedState = (started: boolean) => {
    //     const data = {
    //         started,
    //         timestamp: Date.now()
    //     };
    //     localStorage.setItem('host-game-started', JSON.stringify(data));
    // };

    // const loadGameStartedState = (): boolean => {
    //     const saved = localStorage.getItem('host-game-started');
    //     if (!saved) return false;

    //     try {
    //         const data = JSON.parse(saved);
    //         // Expire after 5 mins (5 * 60 * 1000 = 300000 ms)
    //         const EXPIRE_TIME = 5 * 60 * 1000;
    //         if (Date.now() - data.timestamp > EXPIRE_TIME) {
    //             localStorage.removeItem('host-game-started');
    //             return false;
    //         }
    //         return data.started === true;
    //     } catch {
    //         localStorage.removeItem('host-game-started');
    //         return false;
    //     }
    // };

    const saveData = () => {
        const saved = {
            players: playersData.value.map(player => ({
                id: player.getId(),
                nickname: player.getNickname(),
                score: player.getScore(),
                answers: player.getAnswers(),
                rank: player.getRank()
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
                new PlayerAnswers(player.id, player.nickname, player.score, player.answers || [], player.rank)
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
        
        gameStarted.value = data.gameStarted || false;
    };

    onMounted(async () => {
        const apiManager = APIManager.getInstance();
        const session = await apiManager.getSession();
        if (!(session instanceof HostSession)) {
            AlertService.alert('No host session found. Please create a session first.');
            router.push('/');
            return;
        }
        lobbyCode.value = session.lobbyCode;

        // Load persisted data first
        loadData();

        // Initialize from session data (this will be empty for new lobbies)
        if (session.playerQuestions.value.length > 0) {
            playersData.value = session.playerQuestions.value.map((player: any) => {
                return new PlayerAnswers(
                    player.id || player.getId?.() || '', 
                    player.nickname || player.getNickname?.() || '', 
                    player.score || player.getScore?.() || 0, 
                    player.answers || player.getAnswers?.() || [], 
                    player.rank || player.getRank?.()
                );
            });
        } else if (playersData.value.length === 0) {
            // For fresh lobbies, start with empty player list and request current players
            playersData.value = [];
            session.getPlayers();
        }

        // Watch for question data updates
        watch(
            session.AllQuestionsData,
            (newQuestions) => {
                questions.value = [...newQuestions];
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
                        player.rank || player.getRank?.()
                    );
                }).sort((a, b) => b.getScore() - a.getScore());

                playersData.value = updatedPlayers;
                saveData(); // Persist player updates
            },
            { deep: true }
        );

        session.addEventListener("GAME_STARTED_HOST", () => {
            gameStarted.value = true;
            saveData();
        });

        session.addEventListener("GAME_END", () => {
            gameStarted.value = false;
            saveData();
        });
    });

    return { lobbyCode, playersData, questions, gameStarted };
}