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
            <div class="right border" v-if="players">
                <LeaderboardComponent :players="players" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ScreenBackground from "@/components/ScreenBackground.vue";
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
import CustomButton from "@/components/CustomButton.vue";
import PlayerRank from "@/components/PlayerRank.vue";
import { ref, onMounted } from "vue";
import { PlayerSession } from "@/types/PlayerSession";
import { HostSession } from "@/types/HostSession";
import Logo from "@/components/LogoComponent.vue";
import LeaderboardQuestionCard from "@/components/LeaderboardQuestionCard.vue";
import LeaderboardComponent from "@/components/LeaderboardComponent.vue";
import APIManager from "@/types/APIManager";
import { Session } from "@/types/Session";
import { Question } from "@/types/Question";
import { Player } from "@/types/Player";
import { useRouter } from "vue-router";

const router = useRouter();
const session = ref<any>(null); // Kinda risky, but it works.
const playerRank = ref<number>();
const players = ref<Player[]>();
const playerAnswers = ref<boolean[]>();
const questions = ref<Question[]>();
const isLoading = ref(true);

onMounted(async () => {
    const sessionData: Session | null = await APIManager.getInstance().getSession();
    if (sessionData === null) {
        alert("No session found");
        router.push("/");
        return;
    }
    console.log("Sending leaderboard")
    await sessionData.fetchLeaderboard();
    session.value = sessionData;
    players.value = sessionData.getLeaderboard();
    if (sessionData instanceof PlayerSession) {
        playerAnswers.value = sessionData.getAnswers();
        questions.value = sessionData.getQuestions();
    }
    isLoading.value = false;
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
}
</style>
