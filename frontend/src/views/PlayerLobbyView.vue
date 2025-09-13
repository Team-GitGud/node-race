<template>
    <ScreenBackground blur/>
    <ReturnHomeComponent
        :onConfirm="handleReturnHome"/>
    <h1>Lobby - {{ lobbyCode }}</h1>
    <h3>Welcome: {{ playerName }}</h3>

    <div class="waiting-message">
        <h2>Waiting for Game </h2>
        <h2>{{ currentMessage }}</h2>
    </div>

    <div class="cancel-container">
        <CustomButton :action="() => $router.push('/')" type="negative">Cancel</CustomButton>
    </div>
</template>

<script lang="ts" setup>
import CustomButton from '@/components/CustomButton.vue'
import ScreenBackground from '@/components/ScreenBackground.vue';
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
import router from '@/router';
import APIManager from '@/types/APIManager';
import { GameTimer } from '@/types/GameTimer';
import { PlayerSession } from '@/types/PlayerSession';
import { AlertService } from '@/types/AlertService';
import { ref, onMounted, onUnmounted } from 'vue';
import { usePlayerSession } from '@/types/usePlayerSession';

const waitingMessages = ref(["to Start", "to Start.", "to Start..", "to Start..."]);
const currentMessage = ref<string>(waitingMessages.value[0]);
let intervalId: number | undefined;

const { lobbyCode, playerName } = usePlayerSession();

onMounted(() => {
    intervalId = setInterval(() => {
        const currentIndex = waitingMessages.value.indexOf(currentMessage.value);
        const nextIndex = (currentIndex + 1) % waitingMessages.value.length;
        currentMessage.value = waitingMessages.value[nextIndex];
    }, 500);
});

onUnmounted(() => {
    if (intervalId !== undefined) {
        clearInterval(intervalId);
    }
});

const handleReturnHome = async () => {
    const session: PlayerSession | null = await APIManager.getInstance().getSession() as PlayerSession;
    if (session) {
        session.leaveSession();
    }
    router.push('/');
}
</script>

<style>
.waiting-message {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    position: absolute; bottom: calc(100vh / 2 - 60px)
}

.cancel-container {
    display: flex;
    width: 100%;
    justify-content: center;
    position: absolute; bottom: 20px;
}
</style>