<template>
    <ScreenBackground blur />
    <div class="leaderboard-view">
        <h3 v-if="playerRanks && playerAnswers && playerRank">Your Ranking</h3>
        <h2 v-if="playerRanks && playerAnswers && playerRank">{{ playerRank }}</h2>
        <h3 v-else>Loading...</h3>
        <div class="leaderboard-info" v-if="playerRanks && playerAnswers && playerRank">
            <div class="leaderboard">
                <h4>Leaderboard</h4>
                <ul>
                    <li v-for="(player, index) in playerRanks" :key="index">
                        {{ index + 1 }}. {{ player.name }} - {{ player.score }}
                    </li>
                </ul>
            </div>
            <div class="answers">
                <h4>Answers</h4>
                <ul>
                    <li v-for="(answer, index) in playerAnswers" :key="index">
                        {{ answer.question }} - {{ answer.correct ? '✔' : 'X' }}
                    </li>
                </ul>
            </div>
        </div>
        <CustomButton :action="() => $router.push('/')">Return Home</CustomButton>
    </div>
</template>

<script lang="ts" setup>
import ScreenBackground from '@/components/ScreenBackground.vue';
import CustomButton from '@/components/CustomButton.vue';
import { ref, onMounted } from 'vue';
import APIManager from '@/types/APIManager';
import { PlayerSession } from '@/types/PlayerSession';
import router from '@/router';
import { AlertService } from '@/types/AlertService';

const playerRank = ref();
const playerRanks = ref();
const playerAnswers = ref();

onMounted(() => {
    const session = APIManager.getInstance().getSession();
    if (!session) {
        AlertService.alert('No active session found. Please start a game first.');
        router.push('/');
        return;
    }
    if (!(session instanceof PlayerSession)) {
        AlertService.alert('This view is only available for player sessions.');
        router.push('/');
        return;
    }
    // If game not ended, redirect to question navigation
    // If game ended, call API to get player ranks and scores and fetch player answers
    playerRank.value = 1; // Example rank, replace with API call
    playerRanks.value = [
        { name: 'AlexH', score: 100 },
        { name: 'CaraL', score: 90 },
        { name: 'GalenG', score: 80 },
    ]; // Example ranks, replace with API call
    playerAnswers.value = session.getQuestions().map(q => ({
        question: q.title,
        correct: !!q.answerStatus,
    }));
});
</script>

<style scoped>
.leaderboard-view {
    margin: 20px auto;
    width: 550px;
}
.leaderboard-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.leaderboard-info > div {
    width: 38%;
    background-color: var(--background-color);
    padding: 1.5rem;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--text-color);
}

.leaderboard-info > div ul {
    list-style: none;
    padding: 0;
}

.leaderboard-info > div ul li {
    font-size: 1.3rem;
}

</style>