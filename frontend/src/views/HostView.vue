<template>
    <div class="host-view">
        <h1>Host View</h1>
        <p>Your lobby code is: <strong>{{ lobbyCode }}</strong></p>
    </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import APIManager from '@/types/APIManager';
import { onMounted, ref } from 'vue';

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
</script>