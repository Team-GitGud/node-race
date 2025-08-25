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
                <span>{{ player.score }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Player } from '@/types/Player';

const currentPlayers = ref<Player[]>([]);
const localPlayers = ref<Player[]>([]);
const globalPlayers = ref<Player[]>([]);
const viewLocal = ref(true);

onMounted(() => {
    currentPlayers.value = [
        new Player("1", "John Doe", 100),
        new Player("2", "Jane Smith", 90),
        new Player("3", "Jim Beam", 80),
        new Player("4", "John Doe", 70),
        new Player("5", "Jane Smith", 60),
        new Player("6", "Jim Beam", 50),
        new Player("7", "John Doe", 40),
        new Player("8", "Jane Smith", 30),
        new Player("9", "Jim Beam", 20),
        new Player("10", "John Doe", 10),
    ]
    localPlayers.value = [
        new Player("1", "John Doe", 100),
        new Player("2", "Jane Smith", 70),
        new Player("3", "Jim Beam", 60),
        new Player("4", "John Doe", 70),
        new Player("5", "Jane Smith", 40),
        new Player("6", "Jim Beam", 30),
        new Player("7", "John Doe", 20),
        new Player("8", "Jane Smith", 10),
        new Player("9", "Jim Beam", 0),
        new Player("10", "John Doe", 10),
    ]
    globalPlayers.value = [
        new Player("1", "John Doe", 100),
        new Player("2", "Jane Smith", 90),
        new Player("3", "Jim Beam", 80),
        new Player("4", "John Doe", 70),
        new Player("5", "Jane Smith", 60),
        new Player("6", "Jim Beam", 50),
        new Player("7", "John Doe", 40),
        new Player("8", "Jane Smith", 30),
        new Player("9", "Jim Beam", 20),
        new Player("10", "John Doe", 10),
    ]
    currentPlayers.value.sort((a, b) => b.score - a.score);
});

const setCurrentPlayers = (players: Player[]) => {
    currentPlayers.value = players;
    currentPlayers.value.sort((a, b) => b.score - a.score);
    viewLocal.value = players === localPlayers.value;
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
    justify-content: space-between;
    padding: 0% 15%;
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