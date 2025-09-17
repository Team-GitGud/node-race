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
</template>

<script lang="ts" setup>
import QuestionCard from '@/components/QuestionCard.vue';
import ScreenBackground from '@/components/ScreenBackground.vue';
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
import { usePlayerSession } from '@/types/usePlayerSession';
import { PlayerSession } from '@/types/PlayerSession';
import APIManager from '@/types/APIManager';
import router from '@/router';

const { questions } = usePlayerSession();

const handleReturnHome = async () => {
    const session: PlayerSession | null = await APIManager.getInstance().getSession() as PlayerSession;
    if (session) {
        session.leaveSession();
    }
    router.push('/');
}

</script>

<style>
.question-navigation-view {
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
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