<template>
    <div class="host-view">
        <ReturnHomeComponent message="Are you sure you want to return to the home page? <br/> The session will continue, but you will not be able to reconnect to it."/>
        <h1>Host View</h1>
        <p>Your lobby code is: <strong>{{ lobbyCode }}</strong></p>
        <CustomButton :action="() => startGame()">Start Game</CustomButton>
    </div>
</template>

<script lang="ts" setup>
import CustomButton from '@/components/CustomButton.vue';
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
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