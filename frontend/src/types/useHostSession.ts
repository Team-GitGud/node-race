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

    onMounted(async () => {
        const apiManager = APIManager.getInstance();
        const session = await apiManager.getSession();
        if (!(session instanceof HostSession)) {
            AlertService.alert('No host session found. Please create a session first.');
            router.push('/');
            return;
        }
        lobbyCode.value = session.lobbyCode;
        
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
            // router.push('/leaderboard');
        });
    });

    return { lobbyCode, players, gameStarted };
}