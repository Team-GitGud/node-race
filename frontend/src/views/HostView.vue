<template>
    <div class="host-view">
        <h1>Host View</h1>
        <p>Your lobby code is: <strong>{{ lobbyCode }}</strong></p>
        <CustomButton :action="() => startGame()">Start Game</CustomButton>
    </div>
</template>

<script lang="ts" setup>
import CustomButton from '@/components/CustomButton.vue';
import APIManager from '@/types/APIManager';
import { HostSession } from '@/types/HostSession';
import { useHostSession } from '@/types/useHostSession';

const { lobbyCode } = useHostSession();

const startGame = async () => {
    const apiManager = APIManager.getInstance();
    const session = await apiManager.getSession();
    if (session instanceof HostSession) {
        session.startGame();
    }
};
</script>