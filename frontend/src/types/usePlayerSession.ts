import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import APIManager from './APIManager';
import { PlayerSession } from './PlayerSession';
import { AlertService } from './AlertService';
import { Question } from './Question';

export function usePlayerSession() {
    const lobbyCode = ref('');
    const playerName = ref('');
    const questions = ref<Question[]>([]);
    const router = useRouter();

    onMounted(async () => {
        const apiManager = APIManager.getInstance();
        const session = await apiManager.getSession();
        if (!(session instanceof PlayerSession)) {
            AlertService.alert('No player session found. Please join a session first.');
            router.push('/');
            return;
        }
        lobbyCode.value = session.lobbyCode;
        playerName.value = session.getPlayer().getNickname();
        questions.value = session.getQuestions();

        session.addEventListener("GAME_STARTED", () => {
            router.push('/question-navigation');
        });
    });

    return { lobbyCode, playerName, questions };
}