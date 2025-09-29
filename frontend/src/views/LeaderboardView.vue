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
import { ref, onMounted, onUnmounted } from "vue";
import { PlayerSession } from "@/types/PlayerSession";
import LeaderboardQuestionCard from "@/components/LeaderboardQuestionCard.vue";
import LeaderboardComponent from "@/components/LeaderboardComponent.vue";
import APIManager from "@/types/APIManager";
import { Session } from "@/types/Session";
import { Question } from "@/types/Question";
import { Player } from "@/types/Player";
import { useRouter } from "vue-router";
import { AlertService } from "@/types/AlertService";

const router = useRouter();
const session = ref<Session | null>(null);
const playerRank = ref<number>();
const globalPlayers = ref<Player[]>();
const lobbyPlayers = ref<Player[]>();
const playerAnswers = ref<boolean[]>();
const questions = ref<Question[]>();
const isLoading = ref(true);
const updater = ref<number | null>(null);

onMounted(async () => {
    session.value = await APIManager.getInstance().getSession();

    if (session.value === null) {
        AlertService.alert("No session found");
        router.push("/");
        return;
    }
    await session.value.fetchLeaderboard();
    if (session.value instanceof PlayerSession) {
        await session.value.fetchScore();
        playerRank.value = session.value.getPlayer().getLobbyRank();
        playerAnswers.value = session.value.getAnswers();
        questions.value = session.value.getQuestions();
        globalPlayers.value = session.value.getGlobalLeaderboard();
        lobbyPlayers.value = session.value.getLobbyLeaderboard();
    }
    updater.value = setInterval(async () => {
        if (session.value instanceof PlayerSession) {
            await session.value.fetchLeaderboard();
            globalPlayers.value = session.value.getGlobalLeaderboard();
            lobbyPlayers.value = [...session.value.getLobbyLeaderboard()];
            playerRank.value = session.value.getPlayer().getLobbyRank();
        }
    }, 1000);


    isLoading.value = false;
});

onUnmounted(() => {
    if (updater.value) {
        clearInterval(updater.value);
    }
});
</script>

<style scoped>
.leaderboard-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100dvw;
    gap: 50px
}

.leaderboard-info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    gap: 50px;
}

@media screen and (max-width: 890px) {
    .leaderboard-info {
        flex-direction: column;
        align-items: center;
    }
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
}
</style>
