<template>
    <div class="connection-status">
        <span
            :class="{ 'connected': isConnected, 'disconnected': !isConnected }"
            class="status-light"
        ></span>
        <span>
            {{ isConnected ? 'Connected to Server' : 'Disconnected from Server' }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import APIManager from '@/types/APIManager';

const isConnected = ref(false);
let intervalId: number | undefined;

/**
 * Checks server connection by pinging the health endpoint.
 * Updates isConnected accordingly.
 */
async function checkConnection() {
    isConnected.value = await APIManager.getInstance().healthCheck();
}

onMounted(() => {
    checkConnection();
    intervalId = window.setInterval(checkConnection, 10000);
});

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.connection-status {
    display: flex;
    align-items: center;
    gap: 0.5em;
}

.status-light {
    width: 1em;
    height: 1em;
    border-radius: 50%;
    display: inline-block;
}

.status-light.connected {
    background-color: var(--positive-color);
    box-shadow: 0 0 5px var(--positive-color);
}

.status-light.disconnected {
    background-color: var(--negative-color);
    box-shadow: 0 0 5px var(--negative-color);
}
</style>