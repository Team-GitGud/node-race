<template>
    <div class="leaderboard-component">
        <div class="row" v-for="player in players" :key="player.id">
            <div class="row-one">
                <span>{{ player.score }}</span>
                <span>{{ player.nickname }}</span>
            </div>
            <span>{{ player.score }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Player } from '@/types/Player';

const players = ref<Player[]>([]);

onMounted(() => {
    players.value = [
        new Player("1", "John Doe", 100),
        new Player("2", "Jane Smith", 90),
        new Player("3", "Jim Beam", 80),
    ]
    players.value.sort((a, b) => b.score - a.score);
});
</script>

<style scoped>
.leaderboard-component {
    width: 100%;
    height: 100%;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
}
</style>