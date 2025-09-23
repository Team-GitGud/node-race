<template>
    <CustomButton class="globeButton" shrink :action="() => isOpen = true">
        <FontAwesomeIcon :icon="faGlobe" class="globeIcon" />
    </CustomButton>

    <ModalPopup title="Global Leaderboard" v-if="isOpen" @close="handleClose">
        <template #body>
            <div v-if="loading" style="text-align:center; padding: 1rem;">
                Loading leaderboard...
            </div>
            <div v-else>
                <table v-if="leaderboard.length" class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="entry in leaderboard" :key="entry.rank + entry.name">
                            <td>{{ entry.rank }}</td>
                            <td>{{ entry.name }}</td>
                            <td>{{ entry.score }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-else style="text-align:center; padding: 1rem;">
                    No leaderboard data available.
                </div>
            </div>
        </template>
        <template #footer>
            <CustomButton :action="handleClose" type="negative">Close</CustomButton>
        </template>
    </ModalPopup>  
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import CustomButton from './CustomButton.vue';
import ModalPopup from './ModalPopup.vue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const isOpen = ref(false);
const leaderboard = ref<{ rank: string; name: string; score: string }[]>([]);
const loading = ref(false);

const ws = ref<WebSocket | null>(null);

function openLeaderboardSocket() {
    loading.value = true;
    leaderboard.value = [];

    const apiAddress = process.env.VUE_APP_BACKEND_URL || '';
    const wsProtocol = apiAddress.startsWith('https') ? 'wss' : 'ws';
    const wsUrl = `${apiAddress.replace(/^https?/, wsProtocol)}/api/v1/leaderboard`;
    ws.value = new WebSocket(wsUrl);

    ws.value.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'LEADERBOARD') {
                leaderboard.value = msg.leaderboard || [];
            }
        } catch (e) {
            leaderboard.value = [];
        }
        loading.value = false;
        ws.value?.close();
    };

    ws.value.onerror = () => {
        loading.value = false;
        ws.value?.close();
    };
}

function handleClose() {
    isOpen.value = false;
}

// Fetch leaderboard when modal opens
watch(isOpen, (open) => {
    if (open) openLeaderboardSocket();
});
</script>

<style scoped>
.globeButton :deep(.btn-inner.shrink) {
    padding: 2px 4px;
}

.globeIcon {
    font-size: 21px;
    padding: 3px;
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}
.leaderboard-table th, .leaderboard-table td {
    border: 1px solid var(--accent-color);
    padding: 6px 12px;
    text-align: left;
}
.leaderboard-table th {
    background: var(--accent-color);
    color: var(--background-color);
}
</style>