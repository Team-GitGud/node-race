<template>
    <ScreenBackground blur />
    <Logo />
    <div class="leaderboard-view">
        <h1 class="leaderboard-title">Leaderboard</h1>
        <div class="leaderboard-info">
            <div class="left">
                <div class="player-rank border">
                    <PlayerRank />
                </div>
                <div class="player-answers">
                    <h2>Your Answer</h2>
                    <div v-if="session" class="answer-cards">
                        <LeaderboardQuestionCard v-for="question in session.getQuestions()" :key="question.id"
                            :question="question" />
                    </div>
                </div>
            </div>
            <div class="right border">

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ScreenBackground from "@/components/ScreenBackground.vue";
import CustomButton from "@/components/CustomButton.vue";
import PlayerRank from "@/components/PlayerRank.vue";
import { ref, onMounted } from "vue";
import { PlayerSession } from "@/types/PlayerSession";
import { HostSession } from "@/types/HostSession";
import Logo from "@/components/LogoComponent.vue";
import LeaderboardQuestionCard from "@/components/LeaderboardQuestionCard.vue";
import LeaderboardComponent from "@/components/LeaderboardComponent.vue";

const playerRank = ref();
const playerRanks = ref();
const playerAnswers = ref();
const session = ref<PlayerSession>();

onMounted(() => {
    const mockSession = {
        getQuestions: () => [
            { id: 0, title: "Question 1", answerStatus: true },
            { id: 1, title: "Question 2", answerStatus: false },
            { id: 2, title: "Question 3", answerStatus: true },
            { id: 3, title: "Question 3", answerStatus: true },
            { id: 4, title: "Question 3", answerStatus: true },
            { id: 4, title: "Question 3", answerStatus: true },
            { id: 3, title: "Question 3", answerStatus: true },
            { id: 4, title: "Question 3", answerStatus: true },
            { id: 4, title: "Question 3", answerStatus: true },
        ],
        getAnswers: () => [true, false, true],
        getPlayer: () => ({
            getId: () => "player123",
            getNickname: () => "TestPlayer",
        }),
    };
    session.value = mockSession as any;
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
    width: 35%;
    height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    box-sizing: border-box;
}

.right {
    width: 35%;
    height: 60vh;
    box-sizing: border-box;
}

/*
    Left has 60vh, so I'll assign 20vh to this, and 40vh to the answers.
*/
.player-rank {
    flex: 2;
    width: 100%;
    min-height: 0;
}

.player-answers {
    flex: 4;
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
