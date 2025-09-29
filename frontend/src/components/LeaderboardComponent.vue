<template>
    <div class="leaderboard-component">
        <div class="header">
            <span @click="setCurrentPlayers(localPlayers)" :class="{ active: viewLocal }">Local</span>
            <span @click="setCurrentPlayers(globalPlayers)" :class="{ active: !viewLocal }">Global</span>
        </div>

        <div class="body">
            <div class="row" v-for="player in currentPlayers" :key="player.id">
                <div class="player-info">
                    <span :class="chooseColour(currentPlayers.indexOf(player) + 1)">{{ currentPlayers.indexOf(player) +
                        1 }}.</span>
                    <span class="nickname">{{ player.nickname }}</span>
                </div>
                <span>{{ parseInt(player.score.toString()) }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, watch } from 'vue';
import APIManager from '@/types/APIManager';
import { Player } from '@/types/Player';
import { PlayerSession } from '@/types/PlayerSession';

const props = defineProps<{
    globalPlayers: Player[];
    localPlayers: Player[];
}>();

const currentPlayers = ref<Player[]>([]);
const localPlayers = ref<Player[]>([]);
const globalPlayers = ref<Player[]>([]);
const gameSession = ref<PlayerSession | null>(null);
const viewLocal = ref(true);

onMounted(async () => {
    // Cheaty way to include the user into the global players because it hasn't updated yet.
    const session = await APIManager.getInstance().getSession();
    if (session == null) {
        return;
    }
    gameSession.value = session as PlayerSession;
    currentPlayers.value = props.localPlayers;
    localPlayers.value = [...props.localPlayers];
    globalPlayers.value = [...props.globalPlayers];
    if (session instanceof PlayerSession) {
        globalPlayers.value.push(session.getPlayer());
    }
});

watch(() => props.localPlayers, (newLocalPlayers) => {
    localPlayers.value = [...newLocalPlayers];
    if (viewLocal.value) {
        currentPlayers.value = [...newLocalPlayers];
    }
});

watch(() => props.globalPlayers, (newGlobalPlayers) => {
    globalPlayers.value = [...newGlobalPlayers];
    if (!viewLocal.value) {
        currentPlayers.value = [...newGlobalPlayers];
    }
});

const setCurrentPlayers = (players: Player[]) => {
    currentPlayers.value = players;
    currentPlayers.value.sort((a, b) => b.score - a.score);
    viewLocal.value = !viewLocal.value;
    gameSession.value?.emitEvent("LEADERBOARD_SWITCHED", viewLocal.value ? "lobby" : "global");
}

const chooseColour = (index: number) => {
    switch (index) {
        case 1:
            return "gold"
        case 2:
            return "silver"
        case 3:
            return "bronze"
        default:
            return "participation"
    }
}
</script>

<style scoped>
.leaderboard-component {
    width: 100%;
    height: 100%;
    padding: 5% 10%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.header {
    flex: 1;
    font-size: 51px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--text-color);
}


.header span {
    padding: 5px 10px;
    cursor: pointer;
}

.gold {
    color: var(--gold-color);
}

.silver {
    color: var(--silver-color);
}

.bronze {
    color: var(--bronze-color);
}

.participation {
    color: var(--participation-color);
}

.active {
    border-top: 7px solid var(--text-color);
    border-left: 7px solid var(--text-color);
    border-right: 3px solid var(--text-color);
}

.body {
    flex: 8;
    font-size: 31px;
    overflow-y: scroll;
}

.row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 4% 0%;
    border-bottom: 1px solid var(--text-color);
}

.player-info {
    display: flex;
    gap: 20px;

}

.nickname {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 250px;
}
</style>