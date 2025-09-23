import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import APIManager from './APIManager';
import { HostSession } from './HostSession';
import { AlertService } from './AlertService';
import { Player } from './Player';
import { HostQuestion } from './HostQuestion';
import { HostPlayer } from './HostPlayer';

export function useHostSession() {
    const lobbyCode = ref('');
    const router = useRouter();
    const players = ref<Player[]>([]);
    const gameStarted = ref(false);
    const questions = ref<HostQuestion[]>([]);
    const playersData = ref<HostPlayer[]>([]);
    const gameStartedTime = ref<number | null>(null);

    // Persist game started state with timestamp
    const saveGameStartedState = (started: boolean) => {
        const data = {
            started,
            timestamp: Date.now()
        };
        localStorage.setItem('host-game-started', JSON.stringify(data));
    };

    const loadGameStartedState = (): boolean => {
        const saved = localStorage.getItem('host-game-started');
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);
            // Expire after 5 mins (5 * 60 * 1000 = 300000 ms)
            const EXPIRE_TIME = 5 * 60 * 1000;
            if (Date.now() - data.timestamp > EXPIRE_TIME) {
                localStorage.removeItem('host-game-started');
                return false;
            }
            return data.started === true;
        } catch {
            localStorage.removeItem('host-game-started');
            return false;
        }
    };

    const setStartedTime = () => {
        const data = {
            started: true,
            timestamp: Date.now()
        };
        localStorage.setItem('host-game-started', JSON.stringify(data));
    };

    const getStartedTime = () => {
        const saved = localStorage.getItem('host-game-started');
        if (!saved) return null;
        const data = JSON.parse(saved);
        return data.timestamp;
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

        // Load persisted game started state
        gameStarted.value = loadGameStartedState();

        session.getPlayers(); // Triggers a request - response will be handled by event listeners

        players.value = [...session.players.value];

        if (gameStarted.value) {
            gameStartedTime.value = getStartedTime();
        }

        watch(
            session.players,
            (newPlayers) => {
                console.log('🔄 [useHostSession] Players updated:', newPlayers);
                players.value = [...newPlayers];

                // Convert Player objects to HostPlayer objects with answers and rankings
                const hostPlayers = newPlayers.map((player) => {
                    // For now, initialize with empty answers array
                    // TODO: Get actual answers data from server when available
                    const answers: Array<boolean | null> = [];
        
                    return new HostPlayer(player.id, player.nickname, player.score, answers, 1); // Temporary rank, will be updated below
                });

                playersData.value = hostPlayers;
            },
            { deep: true }
        );

        session.addEventListener("GAME_STARTED_HOST", () => {
            gameStarted.value = true;
            saveGameStartedState(true);
            setStartedTime();
        });

        session.addEventListener("GAME_END", () => {
            gameStarted.value = false;
            saveGameStartedState(false);
        });
    });

    return { lobbyCode, playersData, questions, gameStarted, gameStartedTime };
}