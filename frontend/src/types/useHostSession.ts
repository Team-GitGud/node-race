import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import APIManager from './APIManager';
import { HostSession } from './HostSession';
import { AlertService } from './AlertService';
import { Player } from './Player';

export function useHostSession() {
    const lobbyCode = ref('');
    const router = useRouter();
    const players = ref<Player[]>([]);
    const gameStarted = ref(false);

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

        // Fetch current players from server to handle page refresh/reconnection
        session.getPlayers(); // Triggers a request - response will be handled by event listeners

        // Initialize with session's current players
        players.value = [...session.players.value];

        // Set up watch for future changes to maintain reactivity
        watch(
            session.players,
            (newPlayers) => {
                console.log('🔄 [useHostSession] Players updated:', newPlayers);
                players.value = [...newPlayers];
            },
            { deep: true }
        );

        session.addEventListener("GAME_STARTED_HOST", () => {
            gameStarted.value = true;
            saveGameStartedState(true);
            // router.push('/leaderboard');
        });

        session.addEventListener("GAME_END", () => {
            gameStarted.value = false;
            saveGameStartedState(false);
        });
    });

    return { lobbyCode, players, gameStarted };
}