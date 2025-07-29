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

const isConnected = ref(false);
let intervalId: number | undefined;

async function checkConnection() {
    try {
        const res = await fetch(`${process.env.VUE_APP_BACKEND_URL}/health`);
        isConnected.value = res.ok;
    } catch {
        isConnected.value = false;
    }
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
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: 1px solid #333;
}

.status-light.connected {
    background-color: green;
    box-shadow: 0 0 5px green;
}

.status-light.disconnected {
    background-color: red;
    box-shadow: 0 0 5px red;
}
</style>