<template>
    <ScreenBackground blur />
    <ReturnHomeComponent
        message="Are you sure you want to return to the home page? <br/> You will not be able to return to this page." />
    <div class="leaderboard-view" v-if="session && !isLoading">
        <h1 class="leaderboard-title">Leaderboard</h1>
        <div class="leaderboard-info">
            <div class="left">
                <div class="player-rank border">
                    <PlayerRank :session="session" />
                </div>
                <div class="player-answers" v-if="playerAnswers && questions">
                    <h2>Your Answers:</h2>
                    <div class="answer-cards">
                        <LeaderboardQuestionCard v-for="question in questions" :key="question.id" :question="question"
                            :answerTime="session.getAnswerTimes(question.id)" />
                    </div>
                </div>
            </div>
            <div class="right border" v-if="globalPlayers && lobbyPlayers">
                <LeaderboardComponent :globalPlayers="globalPlayers" :localPlayers="lobbyPlayers" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ScreenBackground from "@/components/ScreenBackground.vue";
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
import PlayerRank from "@/components/PlayerRank.vue";
import { ref, onMounted } from "vue";
import { PlayerSession } from "@/types/PlayerSession";
import LeaderboardQuestionCard from "@/components/LeaderboardQuestionCard.vue";
import LeaderboardComponent from "@/components/LeaderboardComponent.vue";
import APIManager from "@/types/APIManager";
import { Session } from "@/types/Session";
import { Question } from "@/types/Question";
import { Player } from "@/types/Player";
import { useRouter } from "vue-router";

const router = useRouter();
const session = ref<Session | null>(null);
const playerRank = ref<number>();
const globalPlayers = ref<Player[]>();
const lobbyPlayers = ref<Player[]>();
const playerAnswers = ref<boolean[]>();
const questions = ref<Question[]>();
const isLoading = ref(true);

onMounted(async () => {
    session.value = await APIManager.getInstance().getSession();

    if (session.value === null) {
        alert("No session found");
        router.push("/");
        return;
    }
    await session.value.fetchLeaderboard();
    if (session.value instanceof PlayerSession) {
        playerRank.value = session.value.getPlayer().getLobbyRank();
        playerAnswers.value = session.value.getAnswers();
        questions.value = session.value.getQuestions();
        globalPlayers.value = session.value.getGlobalLeaderboard();
        lobbyPlayers.value = session.value.getLobbyLeaderboard();
    }
    isLoading.value = false;
    console.log("Finished mounting");
});
</script>

<style scoped>
.leaderboard-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
}

.leaderboard-info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    margin-top: 5vh;
    width: 100%;
    height: 100%;
    gap: 50px;
}

.leaderboard-title {
    margin-top: 40px;
}

.left {
    width: 450px;
    height: 520px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    box-sizing: border-box;
}

.right {
    width: 450px;
    height: 520px;
    box-sizing: border-box;
}

.player-rank {
    width: 100%;
    padding: 1% 6%;
}

.player-answers {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 0;
}

.answer-cards {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-right: 20px;
    flex: 1;
    overflow-y: scroll;
    box-sizing: border-box;
    min-height: 0;
    scrollbar-width: thin;
    scrollbar-color: white grey;
}

.answer-cards::-webkit-scrollbar {
    width: 8px;
}

.answer-cards::-webkit-scrollbar-track {
    background: white;
    border-radius: 4px;
}

.answer-cards::-webkit-scrollbar-thumb {
    background: white;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.answer-cards::-webkit-scrollbar-thumb:hover {
    background: #f0f0f0;
}
</style>
