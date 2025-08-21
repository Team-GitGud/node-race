<template>
    <div class="join-view">
        <h1>Wait for game to begin</h1>
        <p>Your lobby code is: <strong>{{ lobbyCode }}</strong></p>
        <p>Your player name is: <strong>{{ playerName }}</strong></p>
        <p>Your player ID is: <strong>{{ playerId }}</strong></p>
    </div>
</template>

<script lang="ts" setup>
import APIManager from '@/types/APIManager';
import { PlayerSession } from '@/types/PlayerSession';
import { onMounted, ref } from 'vue';
import router from '@/router';

const lobbyCode = ref('');
const playerName = ref('');
const playerId = ref('');

onMounted(async () => {
    const session = APIManager.getInstance().getSession();
    if (!session) {
        alert('No session found. Please create or join a session first.');
        router.push('/');
        return;
    }
    if (!(session instanceof PlayerSession)) {
        alert('This view is only for players. Please switch to the player view.');
        router.push('/');
        return;
    }
    
    lobbyCode.value = session.lobbyCode;
    playerName.value = session.getPlayer().getNickname();
    playerId.value = session.getPlayer().getId();
});

</script>