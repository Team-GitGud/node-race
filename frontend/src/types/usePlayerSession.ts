import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import APIManager from './APIManager';
import { PlayerSession } from './PlayerSession';
import { AlertService } from './AlertService';
import { Question } from './Question';
import { GameTimer } from './GameTimer';

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

        session.setOnLeaveCallback((reason?: string) => { 
            if (reason) {
                AlertService.alert(`You were kicked: ${reason}`);
            }
            router.push('/'); 
        });

        if (questions.value.length !== 0 && router.currentRoute.value.path === '/lobby') {
            router.push('/question-navigation');
        }

        session.addEventListener("GAME_STARTED", () => {
            console.log("Game started");
            const start = new Date().getTime();
            const fiveMinutes = 1000 * 60 * 5;
            const gameTimer = new GameTimer(start, start + fiveMinutes);
            session.setGameTimer(gameTimer);
            gameTimer.start();
            router.push('/question/0');
        });
    });

    return { lobbyCode, playerName, questions };
}