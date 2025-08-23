import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import APIManager from './APIManager';
import { HostSession } from './HostSession';
import { AlertService } from './AlertService';

export function useHostSession() {
    const lobbyCode = ref('');
    const router = useRouter();

    onMounted(async () => {
        const apiManager = APIManager.getInstance();
        const session = await apiManager.getSession();
        if (!(session instanceof HostSession)) {
            AlertService.alert('No host session found. Please create a session first.');
            router.push('/');
            return;
        }
        lobbyCode.value = session.lobbyCode;

        session.addEventListener("GAME_STARTED_HOST", () => {
            // router.push('/leaderboard');
        });
    });

    return { lobbyCode };
}