<template>
    <ScreenBackground blur/>
    <ReturnHomeComponent
        :onConfirm="handleReturnHome"/>

    <div class="question-navigation-view">
        <h2 class="page-title">Question Navigation</h2>
        <div class="questions-container">
            <div class="question-wrapper" v-for="question in questions" :key="question.id">
                <QuestionCard :question="question" />
            </div>
        </div>
    </div>
    <div class="top-right-buttons">
        <TimerComponent class="timer-component" :gameTimer="gameTimer" />
        <TutorialPopup class="tutorial-popup" />
    </div>
</template>

<script lang="ts" setup>
import QuestionCard from '@/components/QuestionCard.vue';
import ScreenBackground from '@/components/ScreenBackground.vue';
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
import { usePlayerSession } from '@/types/usePlayerSession';
import { PlayerSession } from '@/types/PlayerSession';
import APIManager from '@/types/APIManager';
import router from '@/router';
import TutorialPopup from '@/components/TutorialPopup.vue';
import TimerComponent from '@/components/TimerComponent.vue';
import { onMounted, onUnmounted } from 'vue';

const { questions, gameTimer } = usePlayerSession();

const handleReturnHome = async () => {
    const session: PlayerSession | null = await APIManager.getInstance().getSession() as PlayerSession;
    if (session) {
        session.leaveSession();
    }
    router.push('/');
}


onMounted(async () => {
    const session = await APIManager.getInstance().getSession();
    console.log(session);
    if (!session || !(session instanceof PlayerSession)) return;
    session.getGameTimer()?.start();
    session.addEventListener("GAME_ENDED", handleGameEnded);
    console.log("Game timer started");
});

onUnmounted(async () => {
    // Clean up game end event listener
    const session = await APIManager.getInstance().getSession();
    if (!session || !(session instanceof PlayerSession)) return;
    session.getGameTimer()?.stop();
    session.removeEventListener("GAME_ENDED", handleGameEnded);
    gameTimer.value?.stop();
});

// Handle game end event
const handleGameEnded = (data: any) => {
    console.log("Game ended, navigating to leaderboard", data);
    router.push('/leaderboard');
};


</script>

<style>
.question-navigation-view {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

.page-title {
    justify-self: center;
    padding: 20px;
    border-bottom: 4px solid var(--accent-color);
    width: 650px;
}

.top-right-buttons {
    position: absolute;
    top: 25px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 100;
}

.questions-container {
    position: relative;
    height: calc(100% - 108px);
    overflow-y: auto;
    padding: 20px;
}

.question-wrapper {
    display: block;
}
</style>