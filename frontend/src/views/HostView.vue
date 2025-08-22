<template>
    <div class="host-view">
        <h1>Host View</h1>
        <p>Your lobby code is: <strong>{{ lobbyCode }}</strong></p>
        <CustomButton :action="() => startGame()">Start Game</CustomButton>
    </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import APIManager from '@/types/APIManager';
import CustomButton from '@/components/CustomButton.vue';
import { onMounted, ref } from 'vue';
import { HostSession } from '@/types/HostSession';

const lobbyCode = ref('');

onMounted(async () => {
    const lc = APIManager.getInstance().getSession()?.lobbyCode;
    if (!lc) {
        alert('No lobby code found. Please create a session first.');
        router.push('/');
    } else {
        lobbyCode.value = lc;
    }
});

const startGame = () => {
    const apiManager = APIManager.getInstance();
    // We check to make sure Host is the session.
    if (apiManager.getSession() instanceof HostSession) {
        (apiManager.getSession() as HostSession).startGame();

    }
};
APIManager.getInstance().getSession()?.addEventListener("GAME_STARTED_HOST", (data) => {
    router.push('/leaderboard');
});
</script>